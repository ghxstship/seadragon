#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Script to add "const { paramName } = await params" to page component functions
 * that are missing it after the params.X -> X replacement
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const basePath = '/Users/julianclarkson/Documents/opuszero';

// Find all page.tsx files that use params
let result;
try {
  result = execSync(
    'grep -rl "{ params }" --include="page.tsx" src/app',
    { cwd: basePath, encoding: 'utf-8' }
  );
} catch (e) {
  process.exit(0);
}

const files = result.trim().split('\n').filter(f => f);

let fixedCount = 0;

for (const file of files) {
  const fullPath = path.join(basePath, file);
  let content = fs.readFileSync(fullPath, 'utf-8');
  let modified = false;
  
  // Check what param names are used in this file
  const usesHandle = content.includes('handle') && !content.includes('const { handle }');
  const usesId = /[^a-zA-Z]id[^a-zA-Z]/.test(content) && !content.includes('const { id }') && content.includes('Promise<{ id:');
  const usesSlug = content.includes('slug') && !content.includes('const { slug }') && content.includes('Promise<{ slug:');
  const usesEventId = content.includes('eventId') && !content.includes('const { eventId }');
  const usesType = /[^a-zA-Z]type[^a-zA-Z]/.test(content) && !content.includes('const { type }') && content.includes('Promise<{ type:');
  
  // Pattern to find the main page component function that needs the await params
  // export default async function XXX({ params }: XXXProps) {\n  const
  // We need to add "const { handle } = await params" after the opening brace
  
  if (usesHandle) {
    // Pattern: export default async function XXX({ params }: XXX) {\n  (not followed by const { handle })
    const pattern = /(export default async function \w+\(\{ params \}: \w+\) \{\n)(?!\s*const \{ handle \})/g;
    if (pattern.test(content)) {
      content = content.replace(pattern, '$1  const { handle } = await params\n');
      modified = true;
    }
    
    // Also handle generateMetadata that might be missing it
    const metaPattern = /(export async function generateMetadata\(\{ params \}: \w+\)[^{]*\{\n\s*try \{\n)(?!\s*const \{ handle \})/g;
    if (metaPattern.test(content)) {
      content = content.replace(metaPattern, '$1    const { handle } = await params\n');
      modified = true;
    }
  }
  
  if (usesSlug) {
    const pattern = /(export default async function \w+\(\{ params \}: \w+\) \{\n)(?!\s*const \{ slug \})/g;
    if (pattern.test(content)) {
      content = content.replace(pattern, '$1  const { slug } = await params\n');
      modified = true;
    }
  }
  
  if (usesEventId) {
    const pattern = /(export default async function \w+\(\{ params \}: \w+\) \{\n)(?!\s*const \{ eventId \})/g;
    if (pattern.test(content)) {
      content = content.replace(pattern, '$1  const { eventId } = await params\n');
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content);
    fixedCount++;
  }
}

console.log(`Fixed ${fixedCount} files with await params`);

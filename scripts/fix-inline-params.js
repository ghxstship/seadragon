#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Script to fix Next.js 15 inline params format in page components
 * Changes: { params: { id: string } } -> { params: Promise<{ id: string }> }
 * And makes function async with await params
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all files with inline params format
let result;
try {
  result = execSync(
    'grep -rl "params: { [a-z]*: string }" --include="*.tsx" src/app',
    { cwd: '/Users/julianclarkson/Documents/opuszero', encoding: 'utf-8' }
  );
} catch (e) {
  console.log('No files found to fix');
  process.exit(0);
}

const files = result.trim().split('\n').filter(f => f);
console.log(`Found ${files.length} files to fix`);

let fixedCount = 0;

for (const file of files) {
  const fullPath = path.join('/Users/julianclarkson/Documents/opuszero', file);
  let content = fs.readFileSync(fullPath, 'utf-8');
  let modified = false;
  
  // Skip if already has Promise format in inline definition
  if (content.includes('params: Promise<{ ')) {
    continue;
  }
  
  // Pattern 1: Fix inline single-param definitions
  // { params: { id: string } }
  const singleParamPattern = /\{ params \}: \{ params: \{ (\w+): string \} \}/g;
  if (singleParamPattern.test(content)) {
    content = content.replace(singleParamPattern, '{ params }: { params: Promise<{ $1: string }> }');
    modified = true;
  }
  
  // Pattern 2: Fix inline multi-param definitions  
  // { params: { handle: string; id: string } }
  const multiParamPattern = /\{ params \}: \{ params: \{ (\w+): string; (\w+): string \} \}/g;
  if (multiParamPattern.test(content)) {
    content = content.replace(multiParamPattern, '{ params }: { params: Promise<{ $1: string; $2: string }> }');
    modified = true;
  }
  
  // Pattern 3: Make function async if not already
  // export default function -> export default async function
  if (modified && !content.includes('export default async function')) {
    content = content.replace(
      /export default function (\w+)\(/g,
      'export default async function $1('
    );
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content);
    fixedCount++;
    console.log(`Fixed ${file}`);
  }
}

console.log(`\nFixed ${fixedCount} files`);
console.log('Note: You still need to add "const { paramName } = await params" in function bodies');

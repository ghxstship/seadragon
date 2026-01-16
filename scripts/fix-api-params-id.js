#!/usr/bin/env node
/**
 * Script to fix remaining params.id references in API routes
 * For each file with params.id, ensure the handler has "const { id } = await params"
 * and replace params.id with id
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all files with params.id references
let result;
try {
  result = execSync(
    'grep -rl "params\\.id" --include="*.ts" src/app/api',
    { cwd: '/Users/julianclarkson/Documents/opuszero', encoding: 'utf-8' }
  );
} catch (e) {
  console.log('No files found to fix');
  process.exit(0);
}

const files = result.trim().split('\n').filter(f => f);
console.log(`Found ${files.length} files with params.id references`);

let fixedCount = 0;

for (const file of files) {
  const fullPath = path.join('/Users/julianclarkson/Documents/opuszero', file);
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // Check if file has params.id references
  if (!content.includes('params.id')) {
    continue;
  }
  
  // Replace all params.id with id
  content = content.replace(/params\.id/g, 'id');
  
  // For each handler function, ensure it has "const { id } = await params" after try {
  // Pattern: export async function XXX(\n  request: NextRequest,\n  { params }: { params: Promise<{ id: string }> }\n) {\n  try {
  const handlerPattern = /(export async function \w+\(\s*\n\s*request: NextRequest,\s*\n\s*\{ params \}: \{ params: Promise<\{ id: string \}> \}\s*\n\) \{\s*\n\s*try \{)(\s*\n)(?!\s*const \{ id \} = await params)/g;
  
  content = content.replace(handlerPattern, '$1$2    const { id } = await params\n');
  
  fs.writeFileSync(fullPath, content);
  fixedCount++;
  console.log(`Fixed ${file}`);
}

console.log(`\nFixed ${fixedCount} files`);

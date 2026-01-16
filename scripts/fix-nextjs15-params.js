#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Script to fix Next.js 15 params format in page components
 * Changes: params: { key: string } -> params: Promise<{ key: string }>
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all files with old params format
let result;
try {
  result = execSync(
    'grep -rl "params: {$" --include="*.tsx" src/app',
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
  
  // Pattern for multi-line multi-param interface definitions
  // params: {\n    key1: string\n    key2: string\n  }
  const multiLineMultiParamPattern = /params: \{\s*\n(\s+\w+: string\s*\n)+\s*\}/g;
  
  content = content.replace(multiLineMultiParamPattern, (match) => {
    // Extract the content between { and }
    const inner = match.replace('params: {', '').replace(/\}$/, '');
    return `params: Promise<{${inner}}>`;
  });
  
  fs.writeFileSync(fullPath, content);
  fixedCount++;
  console.log(`Fixed interface in ${file}`);
}

console.log(`\nFixed ${fixedCount} files`);

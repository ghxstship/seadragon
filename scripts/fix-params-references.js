#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Comprehensive script to fix params.handle and params.id references in page components
 * This script:
 * 1. Finds all files with params.handle or params.id references
 * 2. For each file, ensures the function body has the proper await params destructuring
 * 3. Replaces params.handle with handle and params.id with id
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const basePath = '/Users/julianclarkson/Documents/opuszero';

// Find all files with params.handle or params.id references
let result;
try {
  result = execSync(
    'grep -rl "params\\." --include="*.tsx" src/app',
    { cwd: basePath, encoding: 'utf-8' }
  );
} catch (e) {
  console.log('No files found to fix');
  process.exit(0);
}

const files = result.trim().split('\n').filter(f => f);
console.log(`Found ${files.length} files to check`);

let fixedCount = 0;

for (const file of files) {
  const fullPath = path.join(basePath, file);
  let content = fs.readFileSync(fullPath, 'utf-8');
  let modified = false;
  
  // Check if file has params.handle or params.id references
  if (!content.includes('params.handle') && !content.includes('params.id') && !content.includes('params.slug') && !content.includes('params.type')) {
    continue;
  }
  
  // Replace all params.X with X (where X is handle, id, slug, type, etc.)
  const paramPatterns = [
    { pattern: /params\.handle/g, replacement: 'handle' },
    { pattern: /params\.id/g, replacement: 'id' },
    { pattern: /params\.slug/g, replacement: 'slug' },
    { pattern: /params\.type/g, replacement: 'type' },
    { pattern: /params\.contactId/g, replacement: 'contactId' },
    { pattern: /params\.noteId/g, replacement: 'noteId' },
    { pattern: /params\.memberId/g, replacement: 'memberId' },
    { pattern: /params\.provider/g, replacement: 'provider' },
    { pattern: /params\.conversationId/g, replacement: 'conversationId' },
  ];
  
  for (const { pattern, replacement } of paramPatterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content);
    fixedCount++;
    console.log(`Fixed ${file}`);
  }
}

console.log(`\nFixed ${fixedCount} files`);
console.log('\nNote: You may need to manually add "const { paramName } = await params" to function bodies where missing.');

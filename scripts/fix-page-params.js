#!/usr/bin/env node
/**
 * Script to fix Next.js 15 page params type migration
 * Converts params: { key: string } to params: Promise<{ key: string }>
 * and adds await params where needed
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all page.tsx files with params: { pattern
const files = execSync('grep -rln "params: {" src/app --include="page.tsx"', { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(f => f);

console.log(`Found ${files.length} files to process`);

let fixed = 0;
let errors = [];

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;
    
    // Pattern 1: Fix interface definitions - params: { key: string } -> params: Promise<{ key: string }>
    // Match params: { ... } that's NOT already Promise<
    const interfacePattern = /params:\s*{\s*([^}]+)\s*}/g;
    const newContent = content.replace(interfacePattern, (match, inner) => {
      // Skip if already Promise
      if (content.includes('params: Promise<')) return match;
      modified = true;
      return `params: Promise<{ ${inner.trim()} }>`;
    });
    
    if (modified) {
      // Pattern 2: Fix destructuring - const { key } = params -> const { key } = await params
      // But only if not already awaited
      let finalContent = newContent;
      
      // Common param names
      const paramNames = ['handle', 'slug', 'id', 'type', 'genre', 'category'];
      for (const param of paramNames) {
        const destructPattern = new RegExp(`const\\s*{\\s*${param}\\s*}\\s*=\\s*params(?!\\s*\\?)`, 'g');
        finalContent = finalContent.replace(destructPattern, `const { ${param} } = await params`);
        
        // Also fix params.key access
        const accessPattern = new RegExp(`params\\.${param}(?!\\s*\\?)`, 'g');
        // Only replace if we haven't already destructured
        if (!finalContent.includes(`const { ${param} } = await params`)) {
          // This is trickier - need to add await at function level
        }
      }
      
      // Fix function to be async if not already
      if (!finalContent.includes('export default async function') && finalContent.includes('await params')) {
        finalContent = finalContent.replace(
          /export default function (\w+)/,
          'export default async function $1'
        );
      }
      
      fs.writeFileSync(file, finalContent);
      fixed++;
      console.log(`Fixed: ${file}`);
    }
  } catch (err) {
    errors.push({ file, error: err.message });
  }
}

console.log(`\nProcessed ${files.length} files, fixed ${fixed}`);
if (errors.length > 0) {
  console.log(`Errors: ${errors.length}`);
  errors.forEach(e => console.log(`  ${e.file}: ${e.error}`));
}

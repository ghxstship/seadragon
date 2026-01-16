#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Script to fix client components that were incorrectly made async
 * For client components with 'use client', we need to:
 * 1. Remove async from the function
 * 2. Add import { use } from 'react'
 * 3. Change "await params" to "use(params)"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all client components that are async
let result;
try {
  result = execSync(
    'grep -rl "use client" --include="*.tsx" src/app | xargs grep -l "export default async function"',
    { cwd: '/Users/julianclarkson/Documents/opuszero', encoding: 'utf-8' }
  );
} catch (e) {
  console.log('No files found to fix');
  process.exit(0);
}

const files = result.trim().split('\n').filter(f => f);
console.log(`Found ${files.length} client components to fix`);

let fixedCount = 0;

for (const file of files) {
  const fullPath = path.join('/Users/julianclarkson/Documents/opuszero', file);
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // Check if it's a client component with async
  if (!content.includes("'use client'") && !content.includes('"use client"')) {
    continue;
  }
  
  if (!content.includes('export default async function')) {
    continue;
  }
  
  // Remove async from the function
  content = content.replace(
    /export default async function (\w+)/g,
    'export default function $1'
  );
  
  // Change "await params" to "use(params)" 
  content = content.replace(
    /const \{ (\w+) \} = await params/g,
    'const { $1 } = use(params)'
  );
  
  content = content.replace(
    /const \{ (\w+), (\w+) \} = await params/g,
    'const { $1, $2 } = use(params)'
  );
  
  // Add import { use } from 'react' if not already present
  if (content.includes('use(params)') && !content.includes("import { use }") && !content.includes("use,")) {
    // Add use to existing react import or add new import
    if (content.includes("from 'react'") || content.includes('from "react"')) {
      content = content.replace(
        /import \{ ([^}]+) \} from ['"]react['"]/,
        "import { $1, use } from 'react'"
      );
    } else {
      // Add new import after 'use client'
      content = content.replace(
        /(['"]use client['"])\s*\n/,
        "$1\n\nimport { use } from 'react'\n"
      );
    }
  }
  
  fs.writeFileSync(fullPath, content);
  fixedCount++;
  console.log(`Fixed ${file}`);
}

console.log(`\nFixed ${fixedCount} client components`);

/**
 * Script to fix client components that use params Promise without the use() hook
 */

const fs = require('fs');
const path = require('path');

// Get all page.tsx files
function getAllPageFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllPageFiles(fullPath, files);
    } else if (item === 'page.tsx') {
      files.push(fullPath);
    }
  }
  return files;
}

// Fix a single file
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Only process client components
  if (!content.includes("'use client'")) {
    return false;
  }

  // Get actual param names from the file path
  const pathParts = filePath.split('/');
  const actualParamNames = [];
  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i].startsWith('[') && pathParts[i].endsWith(']')) {
      actualParamNames.push(pathParts[i].slice(1, -1));
    }
  }

  if (actualParamNames.length === 0) {
    return false;
  }

  // Check if file uses use(params) but is missing the use import
  if (content.includes('use(params)') && !content.match(/import\s*\{[^}]*\buse\b[^}]*\}\s*from\s*['"]react['"]/)) {
    // Add use to imports
    if (content.includes("from 'react'") || content.includes('from "react"')) {
      content = content.replace(
        /import \{ ([^}]+) \} from ['"]react['"]/,
        (match, imports) => {
          if (!imports.match(/\buse\b/)) {
            return match.replace(imports, `${imports}, use`);
          }
          return match;
        }
      );
      modified = true;
    }
  }

  // Check if file uses params but doesn't have use() hook
  if (content.includes('params: Promise<') && !content.includes('use(params)')) {
    // Add use to imports if not present
    if (!content.includes(' use ') && !content.includes(' use,') && !content.includes(',use ') && !content.includes(', use }') && !content.includes('{ use }')) {
      // Find the react import and add use
      if (content.includes("from 'react'")) {
        content = content.replace(
          /import \{ ([^}]+) \} from 'react'/,
          (match, imports) => {
            if (!imports.includes('use')) {
              return `import { ${imports}, use } from 'react'`;
            }
            return match;
          }
        );
        modified = true;
      }
    }

    // Add the use(params) destructuring after the function declaration
    const funcMatch = content.match(/export default function \w+\([^)]*params[^)]*\)\s*\{/);
    if (funcMatch) {
      const destructure = actualParamNames.join(', ');
      const useStatement = `\n  const { ${destructure} } = use(params)`;
      
      // Check if use(params) already exists
      if (!content.includes('use(params)')) {
        content = content.replace(
          funcMatch[0],
          funcMatch[0] + useStatement
        );
        modified = true;
      }
    }
  }

  // Fix any remaining undefined variable references
  const commonAliases = [
    'slug', 'handle', 'category', 'region', 'album', 'type', 'subcategory', 'genre', 'version',
    'noteId', 'reportId', 'userId', 'maintenanceId', 'interviewId', 'feedbackId', 'submissionId',
    'eventId', 'responseId', 'analyticsId', 'rfpId', 'proposalId', 'talentId', 'jobId',
    'castingId', 'auditionId', 'applicationId', 'surveyId', 'vendorId', 'equipmentId'
  ];

  for (const alias of commonAliases) {
    if (content.includes(`\${${alias}}`) && !actualParamNames.includes(alias)) {
      const lastParam = actualParamNames[actualParamNames.length - 1];
      if (lastParam) {
        content = content.replace(new RegExp(`\\$\\{${alias}\\}`, 'g'), `\${${lastParam}}`);
        modified = true;
      }
    }
  }

  // Fix implicit any type in callbacks like (l => l.toUpperCase())
  content = content.replace(/\((\w)\s*=>\s*\1\.toUpperCase\(\)\)/g, '(($1: string) => $1.toUpperCase())');
  if (content !== fs.readFileSync(filePath, 'utf8')) {
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

// Main
const appDir = path.join(__dirname, '../src/app');
const files = getAllPageFiles(appDir);

let fixedCount = 0;
for (const file of files) {
  if (fixFile(file)) {
    fixedCount++;
    console.log(`Fixed: ${file}`);
  }
}

console.log(`\nTotal files fixed: ${fixedCount}`);

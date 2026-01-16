#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Comprehensive script to fix all remaining params.X references in page components
 * by replacing them with the destructured variable
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const basePath = '/Users/julianclarkson/Documents/opuszero';

// Find all files with params. references
let result;
try {
  result = execSync(
    'grep -rln "params\\." --include="*.tsx" src/app',
    { cwd: basePath, encoding: 'utf-8' }
  );
} catch (e) {
  console.log('No files found to fix');
  process.exit(0);
}

const files = result.trim().split('\n').filter(f => f);
console.log(`Found ${files.length} files to check`);

let fixedCount = 0;

// Common param names to replace
const paramNames = [
  'handle', 'id', 'slug', 'type', 'contactId', 'noteId', 'memberId', 
  'provider', 'conversationId', 'eventId', 'reportId', 'personId',
  'vehicleId', 'equipmentId', 'maintenanceId', 'artistId', 'album',
  'category', 'subcategory', 'department', 'version', 'genre', 'region',
  'organizationId', 'workspaceId', 'projectId', 'taskId', 'documentId'
];

for (const file of files) {
  const fullPath = path.join(basePath, file);
  let content = fs.readFileSync(fullPath, 'utf-8');
  let modified = false;
  
  // Skip URLSearchParams usage (params.append, params.toString, etc.)
  // Only fix params.X where X is a route parameter
  
  for (const paramName of paramNames) {
    const pattern = new RegExp(`params\\.${paramName}(?![a-zA-Z])`, 'g');
    if (pattern.test(content)) {
      content = content.replace(pattern, paramName);
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

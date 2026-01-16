#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Script to fix Select component props that are not supported
 * Removes id, className, and required props from Select components
 */

const fs = require('fs');
const path = require('path');

const files = [
  'src/app/auth/verify-identity/page.tsx',
  'src/app/auth/signup/professional/page.tsx',
  'src/app/auth/mfa/setup/sms/page.tsx',
  'src/app/auth/verify-phone/page.tsx',
  'src/app/auth/onboarding/organization/create/page.tsx',
  'src/app/auth/onboarding/preferences/page.tsx',
  'src/app/auth/onboarding/profile/details/page.tsx',
  'src/app/auth/onboarding/page.tsx'
];

let fixedCount = 0;

for (const file of files) {
  const fullPath = path.join('/Users/julianclarkson/Documents/opuszero', file);
  
  if (!fs.existsSync(fullPath)) {
    continue;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  let modified = false;
  
  // Pattern to match Select with unsupported props
  // <Select\n  id="..."\n  className="..."\n  required\n>
  const selectPattern = /<Select\s*\n\s*id="[^"]*"\s*\n\s*className="[^"]*"\s*\n\s*required\s*\n\s*>/g;
  
  if (selectPattern.test(content)) {
    content = content.replace(selectPattern, '<Select\n              >');
    modified = true;
  }
  
  // Also handle single-line patterns
  const selectPattern2 = /<Select\s+id="[^"]*"\s+className="[^"]*"\s+required\s*>/g;
  if (selectPattern2.test(content)) {
    content = content.replace(selectPattern2, '<Select>');
    modified = true;
  }
  
  // Handle Select with just id and className (no required)
  const selectPattern3 = /<Select\s*\n\s*id="[^"]*"\s*\n\s*className="[^"]*"\s*\n\s*>/g;
  if (selectPattern3.test(content)) {
    content = content.replace(selectPattern3, '<Select\n              >');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content);
    fixedCount++;
    console.log(`Fixed ${file}`);
  }
}

console.log(`\nFixed ${fixedCount} files`);

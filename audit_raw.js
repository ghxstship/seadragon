import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function auditFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const hasButton = content.includes('<button');
  const hasButtonImport = content.includes("import { Button }") || content.includes("import Button");

  if (hasButton && !hasButtonImport) {
    console.log(`VIOLATION: Raw <button> without Button import: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx')) {
      auditFile(filePath);
    }
  }
}

console.log('Auditing raw HTML elements...');
walkDir('/Users/julianclarkson/Documents/opuszero/src');
console.log('Audit completed');

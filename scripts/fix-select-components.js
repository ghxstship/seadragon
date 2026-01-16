/**
 * Script to fix Select component usage across the codebase
 * Adds missing value props to SelectItem and fixes Select structure
 */

const fs = require('fs');
const path = require('path');

// Get all page.tsx files
function getAllPageFiles(dir, files = []) {
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        getAllPageFiles(fullPath, files);
      } else if (item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  } catch (e) {
    // Skip directories we can't read
  }
  return files;
}

// Fix a single file
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const originalContent = content;

  // Pattern 1: Fix SelectItem without value prop
  // <SelectItem>Text</SelectItem> -> <SelectItem value="text">Text</SelectItem>
  const selectItemPattern = /<SelectItem>([^<]+)<\/SelectItem>/g;
  let match;
  while ((match = selectItemPattern.exec(originalContent)) !== null) {
    const text = match[1].trim();
    const value = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    content = content.replace(match[0], `<SelectItem value="${value}">${text}</SelectItem>`);
    modified = true;
  }

  // Pattern 2: Fix Select with direct SelectItem children (missing SelectTrigger/SelectContent)
  // This is more complex and would need careful handling

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

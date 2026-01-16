import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Inline style replacements for common static styles
const inlineReplacements = [
  {
    pattern: /style=\{\{ width: '100%', height: '100%' \}\}/g,
    replacement: 'className="w-full h-full"'
  },
  {
    pattern: /style=\{\{ height: '40px' \}\}/g,
    replacement: 'className="h-10"'
  },
  {
    pattern: /style=\{\{ height: '24px' \}\}/g,
    replacement: 'className="h-6"'
  },
  {
    pattern: /style=\{\{ width: '100%' \}\}/g,
    replacement: 'className="w-full"'
  },
  {
    pattern: /style=\{\{ height: '100%' \}\}/g,
    replacement: 'className="h-full"'
  },
  {
    pattern: /style=\{\{ width: '50%' \}\}/g,
    replacement: 'className="w-1/2"'
  },
  {
    pattern: /style=\{\{ width: '25%' \}\}/g,
    replacement: 'className="w-1/4"'
  },
  {
    pattern: /style=\{\{ width: '75%' \}\}/g,
    replacement: 'className="w-3/4"'
  },
  {
    pattern: /style=\{\{ margin: '0' \}\}/g,
    replacement: 'className="m-0"'
  },
  {
    pattern: /style=\{\{ padding: '0' \}\}/g,
    replacement: 'className="p-0"'
  },
  // Add more as needed
];

function migrateFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let changed = false;

  for (const { pattern, replacement } of inlineReplacements) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`Migrated inline styles: ${filePath}`);
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
      migrateFile(filePath);
    }
  }
}

walkDir('/Users/julianclarkson/Documents/opuszero/src');
console.log('Inline style migration completed');

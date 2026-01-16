import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Migrations: old -> new
const migrations = {
  'bg-blue-400': 'bg-accent-primary',
  'bg-blue-500': 'bg-accent-primary',
  'bg-blue-600': 'bg-accent-secondary',
  'bg-blue-700': 'bg-accent-tertiary',
  'bg-blue-800': 'bg-accent-tertiary',
  'bg-blue-900': 'bg-accent-tertiary',
  'text-blue-500': 'text-accent-primary',
  'text-blue-600': 'text-accent-secondary',
  'text-blue-700': 'text-accent-tertiary',
  'border-blue-500': 'border-accent-primary',
  'ring-blue-500': 'ring-accent-primary',
  'text-gray-400': 'text-neutral-400',
  'text-gray-500': 'text-neutral-500',
  'text-gray-600': 'text-neutral-600',
  'text-gray-700': 'text-neutral-700',
  'text-gray-800': 'text-neutral-800',
  'text-gray-900': 'text-neutral-900',
  'bg-gray-100': 'bg-neutral-100',
  'bg-gray-200': 'bg-neutral-200',
  'bg-gray-300': 'bg-neutral-300',
  'bg-gray-400': 'bg-neutral-400',
  'bg-gray-500': 'bg-neutral-500',
  'bg-gray-600': 'bg-neutral-600',
  'bg-gray-700': 'bg-neutral-700',
  'bg-gray-800': 'bg-neutral-800',
  'bg-gray-900': 'bg-neutral-900',
  'border-gray-200': 'border-neutral-200',
  'border-gray-300': 'border-neutral-300',
  'border-gray-400': 'border-neutral-400',
  'border-gray-500': 'border-neutral-500',
  'bg-green-400': 'bg-semantic-success',
  'bg-green-500': 'bg-semantic-success',
  'bg-green-600': 'bg-semantic-success',
  'text-green-500': 'text-semantic-success',
  'text-green-600': 'text-semantic-success',
  'text-green-700': 'text-semantic-success',
  'bg-red-400': 'bg-semantic-error',
  'bg-red-500': 'bg-semantic-error',
  'bg-red-600': 'bg-semantic-error',
  'text-red-500': 'text-semantic-error',
  'text-red-600': 'text-semantic-error',
  'text-red-700': 'text-semantic-error',
  'bg-yellow-400': 'bg-semantic-warning',
  'bg-yellow-500': 'bg-semantic-warning',
  'bg-yellow-600': 'bg-semantic-warning',
  'text-yellow-500': 'text-semantic-warning',
  'text-yellow-600': 'text-semantic-warning',
  'text-yellow-700': 'text-semantic-warning',
  'bg-cyan-400': 'bg-semantic-info',
  'bg-cyan-500': 'bg-semantic-info',
  'bg-cyan-600': 'bg-semantic-info',
  'text-cyan-500': 'text-semantic-info',
  'text-cyan-600': 'text-semantic-info',
  'text-cyan-700': 'text-semantic-info',
  'text-white': 'text-primary-foreground',
  'bg-white': 'bg-background',
  'text-black': 'text-foreground',
  'bg-black': 'bg-neutral-900'
};

function migrateFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let changed = false;

  for (const [old, new_] of Object.entries(migrations)) {
    if (content.includes(old)) {
      content = content.replace(new RegExp(old, 'g'), new_);
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`Migrated: ${filePath}`);
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
console.log('Migration completed');

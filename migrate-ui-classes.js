#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mappings for hardcoded classes to token-based classes
const classMappings = {
  // Background colors
  'bg-blue-500': 'bg-accent-primary',
  'bg-blue-100': 'bg-accent-primary/10',
  'bg-green-500': 'bg-semantic-success',
  'bg-green-100': 'bg-semantic-success/10',
  'bg-red-500': 'bg-semantic-error',
  'bg-red-100': 'bg-semantic-error/10',
  'bg-yellow-500': 'bg-semantic-warning',
  'bg-yellow-100': 'bg-semantic-warning/10',
  'bg-purple-500': 'bg-accent-primary',
  'bg-purple-100': 'bg-accent-primary/10',
  'bg-orange-500': 'bg-semantic-warning',
  'bg-orange-100': 'bg-semantic-warning/10',
  'bg-gray-100': 'bg-neutral-100',
  'bg-gray-200': 'bg-neutral-200',
  'bg-gray-300': 'bg-neutral-300',
  'bg-gray-400': 'bg-neutral-400',
  'bg-gray-500': 'bg-neutral-500',
  'bg-gray-600': 'bg-neutral-600',
  'bg-gray-700': 'bg-neutral-700',
  'bg-gray-800': 'bg-neutral-800',
  'bg-gray-900': 'bg-neutral-900',
  'bg-blue-600': 'bg-accent-secondary',
  'bg-green-600': 'bg-semantic-success',
  'bg-red-600': 'bg-semantic-error',
  'bg-yellow-600': 'bg-semantic-warning',
  'bg-purple-600': 'bg-accent-primary',
  'bg-orange-600': 'bg-semantic-warning',

  // Text colors
  'text-blue-500': 'text-accent-primary',
  'text-green-500': 'text-semantic-success',
  'text-red-500': 'text-semantic-error',
  'text-yellow-500': 'text-semantic-warning',
  'text-purple-500': 'text-accent-primary',
  'text-orange-500': 'text-semantic-warning',
  'text-gray-100': 'text-neutral-100',
  'text-gray-200': 'text-neutral-200',
  'text-gray-300': 'text-neutral-300',
  'text-gray-400': 'text-neutral-400',
  'text-gray-500': 'text-neutral-500',
  'text-gray-600': 'text-neutral-600',
  'text-gray-700': 'text-neutral-700',
  'text-gray-800': 'text-neutral-800',
  'text-gray-900': 'text-neutral-900',
  'text-blue-600': 'text-accent-secondary',
  'text-green-600': 'text-semantic-success',
  'text-red-600': 'text-semantic-error',
  'text-yellow-600': 'text-semantic-warning',
  'text-purple-600': 'text-accent-primary',
  'text-orange-600': 'text-semantic-warning',

  // Border colors
  'border-blue-500': 'border-accent-primary',
  'border-green-500': 'border-semantic-success',
  'border-red-500': 'border-semantic-error',
  'border-yellow-500': 'border-semantic-warning',
  'border-gray-200': 'border-neutral-200',
  'border-gray-300': 'border-neutral-300',

  // Ring colors
  'ring-blue-500': 'ring-accent-primary',
  'ring-green-500': 'ring-semantic-success',
  'ring-red-500': 'ring-semantic-error',
  'ring-yellow-500': 'ring-semantic-warning',
  'ring-gray-500': 'ring-neutral-500',

  // Hover states
  'hover:bg-blue-600': 'hover:bg-accent-secondary',
  'hover:bg-green-600': 'hover:bg-semantic-success',
  'hover:bg-red-600': 'hover:bg-semantic-error',
  'hover:bg-yellow-600': 'hover:bg-semantic-warning',
  'hover:text-blue-600': 'hover:text-accent-secondary',
  'hover:text-green-600': 'hover:text-semantic-success',
  'hover:text-red-600': 'hover:text-semantic-error',
  'hover:text-yellow-600': 'hover:text-semantic-warning',
};

function replaceInlineStyles(content) {
  // Replace style={{ width: 'X%' }} with className="w-[X%]"
  // If className already exists, append to it
  content = content.replace(/className="([^"]*)" style=\{{\s*width:\s*'(\d+)%'\s*}}/g, 'className="$1 w-[$2%]"');
  // If no className, add it
  content = content.replace(/style=\{{\s*width:\s*'(\d+)%'\s*}}/g, 'className="w-[$1%]"');
  content = mergeDuplicateClassNames(content);
  return content;
}

function mergeDuplicateClassNames(content) {
  // Merge duplicate className attributes
  content = content.replace(/className="([^"]*)" className="([^"]*)"/g, 'className="$1 $2"');
  return content;
}

function replaceHardcodedClasses(content) {
  for (const [oldClass, newClass] of Object.entries(classMappings)) {
    // Replace in className strings
    const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
    content = content.replace(regex, newClass);
  }
  return content;
}

function replaceRawHTMLElements(content) {
  // Replace <button with <Button and add import if needed
  if (content.includes('<button') && !content.includes('import.*Button')) {
    // Add import at the top, after other imports
    const importLine = 'import { Button } from "@/components/ui/button"';
    // Find the last import line
    const lines = content.split('\n');
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import')) {
        lastImportIndex = i;
      } else if (lines[i].trim() !== '') {
        break;
      }
    }
    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, importLine);
      content = lines.join('\n');
    }
  }
  content = content.replace(/<button/g, '<Button');
  content = content.replace(/<\/button>/g, '</Button>');

  // Replace <input with <Input
  if (content.includes('<input') && !content.includes('import.*Input')) {
    const importLine = 'import { Input } from "@/components/ui/input"';
    const lines = content.split('\n');
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import')) {
        lastImportIndex = i;
      } else if (lines[i].trim() !== '') {
        break;
      }
    }
    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, importLine);
      content = lines.join('\n');
    }
  }
  content = content.replace(/<input/g, '<Input');
  content = content.replace(/(<Input[^>]*)(\/?>)/g, '$1 />'); // Make self-closing

  // Similarly for Select
  if (content.includes('<select') && !content.includes('import.*Select')) {
    const importLine = 'import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"';
    const lines = content.split('\n');
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import')) {
        lastImportIndex = i;
      } else if (lines[i].trim() !== '') {
        break;
      }
    }
    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, importLine);
      content = lines.join('\n');
    }
  }
  content = content.replace(/<select/g, '<Select');
  content = content.replace(/<\/select>/g, '</Select>');
  // Also replace <option with <SelectItem
  content = content.replace(/<option/g, '<SelectItem');
  content = content.replace(/<\/option>/g, '</SelectItem>');

  // For textarea
  if (content.includes('<textarea') && !content.includes('import.*Textarea')) {
    const importLine = 'import { Textarea } from "@/components/ui/textarea"';
    const lines = content.split('\n');
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import')) {
        lastImportIndex = i;
      } else if (lines[i].trim() !== '') {
        break;
      }
    }
    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, importLine);
      content = lines.join('\n');
    }
  }
  content = content.replace(/<textarea/g, '<Textarea');
  content = content.replace(/<\/textarea>/g, '</Textarea>');

  return content;
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  newContent = replaceInlineStyles(newContent);
  newContent = replaceRawHTMLElements(newContent);
  newContent = replaceHardcodedClasses(newContent);
  newContent = mergeDuplicateClassNames(newContent);

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${filePath}`);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      processFile(filePath);
    }
  }
}

const srcDir = path.join(__dirname, 'src');
walkDirectory(srcDir);

console.log('Migration script completed.');

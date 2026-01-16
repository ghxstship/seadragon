#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Script to fix duplicate variable declarations caused by params destructuring
 * When we added "const { handle } = use(params)" but the file already had
 * "const [handle, setHandle] = useState('')", we get duplicate declarations.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const basePath = '/Users/julianclarkson/Documents/opuszero';

// Find all client component files that use both use(params) and useState for the same variable
let result;
try {
  result = execSync(
    'grep -rln "use(params)" --include="*.tsx" src/app',
    { cwd: basePath, encoding: 'utf-8' }
  );
} catch (e) {
  console.log('No files found');
  process.exit(0);
}

const files = result.trim().split('\n').filter(f => f);
console.log(`Found ${files.length} files with use(params)`);

let fixedCount = 0;

// Variable names that might have duplicates
const varNames = ['handle', 'slug', 'id', 'album', 'category', 'product', 'eventId', 'type'];

for (const file of files) {
  const fullPath = path.join(basePath, file);
  let content = fs.readFileSync(fullPath, 'utf-8');
  let modified = false;
  
  for (const varName of varNames) {
    // Check if file has both use(params) destructuring and useState for the same variable
    const hasUseParams = content.includes(`const { ${varName} } = use(params)`);
    const hasUseState = new RegExp(`const \\[${varName},\\s*set\\w+\\]\\s*=\\s*useState`).test(content);
    
    if (hasUseParams && hasUseState) {
      // Remove the useState declaration for this variable
      const useStatePattern = new RegExp(`\\s*const \\[${varName},\\s*set\\w+\\]\\s*=\\s*useState[^\\n]*\\n`, 'g');
      content = content.replace(useStatePattern, '\n');
      
      // Also remove any useEffect that was setting this variable from params
      // Pattern: useEffect(() => { params.then(p => setX(p.X)) }, [params])
      const setterName = 'set' + varName.charAt(0).toUpperCase() + varName.slice(1);
      const useEffectPattern = new RegExp(
        `\\s*(?:\\/\\/[^\\n]*\\n)?\\s*useEffect\\(\\(\\)\\s*=>\\s*\\{?\\s*(?:params\\.then\\(p\\s*=>\\s*${setterName}\\(p\\.${varName}\\)\\)|)\\s*\\}?,?\\s*\\[params\\]\\)`,
        'g'
      );
      content = content.replace(useEffectPattern, '');
      
      modified = true;
      console.log(`Fixed duplicate ${varName} in ${file}`);
    }
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content);
    fixedCount++;
  }
}

console.log(`\nFixed ${fixedCount} files`);

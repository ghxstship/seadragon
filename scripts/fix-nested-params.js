/**
 * Script to fix TypeScript errors in deeply nested placeholder pages
 * These pages have incorrect param handling - they use params.reportId directly
 * instead of awaiting and destructuring the params Promise
 */

const fs = require('fs');
const path = require('path');

// Get all page.tsx files in the dashboard directory
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

  // Get actual param names from the file path
  const pathParts = filePath.split('/');
  const actualParamNames = [];
  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i].startsWith('[') && pathParts[i].endsWith(']')) {
      actualParamNames.push(pathParts[i].slice(1, -1));
    }
  }

  // Pattern 1: Fix any incorrect param type declarations
  // Match Promise<{ ... }> and replace with correct params from path
  const paramTypeMatch = content.match(/Promise<\{[^}]+\}>/);
  if (paramTypeMatch && actualParamNames.length >= 1) {
    const correctParamType = actualParamNames.map(p => `${p}: string`).join('; ');
    const expectedType = `Promise<{ ${correctParamType} }>`;
    
    if (paramTypeMatch[0] !== expectedType) {
      content = content.replace(
        /Promise<\{[^}]+\}>/,
        expectedType
      );
      modified = true;
    }
  }

  // Pattern 2: Fix any incorrect destructuring
  // Match const { ... } = await params and fix to match actual route params
  const destructureMatch = content.match(/const \{[^}]+\} = await params/);
  if (destructureMatch && actualParamNames.length >= 1) {
    const correctDestructure = actualParamNames.join(', ');
    const expectedDestructure = `const { ${correctDestructure} } = await params`;
    
    if (destructureMatch[0] !== expectedDestructure) {
      content = content.replace(
        /const \{[^}]+\} = await params/,
        expectedDestructure
      );
      modified = true;
    }
  }

  // Pattern 3: Fix params.* references - replace with the actual variable name
  // e.g., params.reportId -> id (the last param), params.userId -> id
  const paramsRefMatch = content.match(/params\.(\w+)/g);
  if (paramsRefMatch && actualParamNames.length >= 1) {
    for (const ref of paramsRefMatch) {
      const varName = ref.replace('params.', '');
      // Replace with the last actual param name
      const lastParam = actualParamNames[actualParamNames.length - 1];
      content = content.replace(new RegExp(`params\\.${varName}`, 'g'), lastParam);
      modified = true;
    }
  }

  // Pattern 3b: Fix standalone variable references that don't match actual params
  // e.g., noteId -> id, maintenanceId -> id when the actual param is 'id'
  const commonAliases = [
    'noteId', 'reportId', 'userId', 'maintenanceId', 'interviewId', 'feedbackId', 'submissionId',
    'eventId', 'responseId', 'analyticsId', 'rfpId', 'proposalId', 'talentId', 'jobId',
    'castingId', 'auditionId', 'applicationId', 'surveyId', 'vendorId', 'equipmentId',
    'ticketId', 'orderId', 'invoiceId', 'paymentId', 'contractId', 'documentId', 'fileId',
    'messageId', 'notificationId', 'commentId', 'reviewId', 'ratingId', 'bookingId',
    'reservationId', 'appointmentId', 'scheduleId', 'taskId', 'projectId', 'teamId',
    'memberId', 'roleId', 'permissionId', 'settingId', 'configId', 'templateId',
    'formId', 'fieldId', 'optionId', 'choiceId', 'answerQuestionId', 'categoryId',
    'tagId', 'labelId', 'statusId', 'priorityId', 'typeId', 'kindId', 'versionId'
  ];
  for (const alias of commonAliases) {
    if (content.includes(alias) && !actualParamNames.includes(alias)) {
      // Find the actual param this should map to (usually the last one)
      const lastParam = actualParamNames[actualParamNames.length - 1];
      if (lastParam) {
        // Replace ${alias} with ${lastParam}
        content = content.replace(new RegExp(`\\$\\{${alias}\\}`, 'g'), `\${${lastParam}}`);
        // Replace {alias} with {lastParam} (but not inside ${})
        content = content.replace(new RegExp(`(?<!\\$)\\{${alias}\\}`, 'g'), `{${lastParam}}`);
        modified = true;
      }
    }
  }

  // Pattern 4: Fix ${id} references when id is not an actual param
  // Replace with the first actual param that makes sense
  if (!actualParamNames.includes('id') && content.includes('${id}')) {
    // Find the most likely replacement - usually the first param
    const firstParam = actualParamNames[0];
    if (firstParam) {
      content = content.replace(/\$\{id\}/g, `\${${firstParam}}`);
      modified = true;
    }
  }

  // Pattern 4b: Fix other common standalone variables that aren't IDs
  const otherAliases = ['slug', 'handle', 'category', 'region', 'album', 'type', 'subcategory', 'genre', 'version'];
  for (const alias of otherAliases) {
    if (content.includes(`\${${alias}}`) && !actualParamNames.includes(alias)) {
      // Find the actual param this should map to
      const lastParam = actualParamNames[actualParamNames.length - 1];
      if (lastParam) {
        content = content.replace(new RegExp(`\\$\\{${alias}\\}`, 'g'), `\${${lastParam}}`);
        modified = true;
      }
    }
    // Also fix {alias} display references
    if (content.match(new RegExp(`(?<!\\$)\\{${alias}\\}`)) && !actualParamNames.includes(alias)) {
      const lastParam = actualParamNames[actualParamNames.length - 1];
      if (lastParam) {
        content = content.replace(new RegExp(`(?<!\\$)\\{${alias}\\}`, 'g'), `{${lastParam}}`);
        modified = true;
      }
    }
  }

  // Pattern 6: Fix {id} display references when id is not an actual param
  if (!actualParamNames.includes('id') && content.match(/\{id\}(?!\})/)) {
    const firstParam = actualParamNames[0];
    if (firstParam) {
      content = content.replace(/\{id\}(?!\})/g, `{${firstParam}}`);
      modified = true;
    }
  }

  // Pattern 5: Add async if missing and using await
  if (content.includes('await params') && !content.includes('async function')) {
    content = content.replace(
      /export default function/,
      'export default async function'
    );
    modified = true;
  }

  // Pattern 7: Server components that use params Promise but don't await it
  // Check if file has params: Promise<...> but no await params or use(params)
  if (content.includes('params: Promise<') && !content.includes('await params') && !content.includes('use(params)') && !content.includes("'use client'")) {
    // This is a server component that needs await params
    const funcMatch = content.match(/export default (async )?function \w+\([^)]*params[^)]*\)\s*\{/);
    if (funcMatch) {
      const destructure = actualParamNames.join(', ');
      const awaitStatement = `\n  const { ${destructure} } = await params`;
      
      // Make sure function is async
      if (!funcMatch[1]) {
        content = content.replace(
          /export default function/,
          'export default async function'
        );
      }
      
      // Add the await params destructuring
      content = content.replace(
        /export default async function \w+\([^)]*params[^)]*\)\s*\{/,
        (match) => match + awaitStatement
      );
      modified = true;
    }
  }

  // Pattern 8: Fix implicit any type in callbacks like (l => l.toUpperCase())
  if (content.match(/\(\w\s*=>\s*\w\.toUpperCase\(\)\)/)) {
    content = content.replace(/\((\w)\s*=>\s*\1\.toUpperCase\(\)\)/g, '(($1: string) => $1.toUpperCase())');
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

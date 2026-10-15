// fix-imports.mjs - Add missing getSessionOrgId imports
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const appDir = 'c:/Users/imran/Documents/server/texttile-erp-2026/app';
const importLine = 'import { getSessionOrgId } from "@/lib/session";';

function walk(dir) {
  let results = [];
  const list = readdirSync(dir);
  for (const file of list) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(filePath);
    }
  }
  return results;
}

const files = walk(appDir);
let fixed = 0;

for (const filePath of files) {
  const content = readFileSync(filePath, 'utf8');
  
  // Check if file uses getSessionOrgId but doesn't import it
  if (content.includes('getSessionOrgId') && !content.includes('import') || 
      (content.includes('getSessionOrgId') && !content.match(/import\s.*getSessionOrgId/))) {
    
    if (content.match(/import\s.*getSessionOrgId/)) continue; // already has import
    
    const lines = content.split('\n');
    
    // Find last import line
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportIdx = i;
      }
    }
    
    if (lastImportIdx >= 0) {
      // Insert after the last import
      lines.splice(lastImportIdx + 1, 0, importLine);
    } else {
      // Find "use server" or insert at top
      let insertIdx = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('"use server"') || lines[i].includes("'use server'")) {
          insertIdx = i + 1;
          // Skip blank line after use server if present
          if (insertIdx < lines.length && lines[insertIdx].trim() === '') {
            insertIdx++;
          }
          break;
        }
      }
      lines.splice(insertIdx, 0, importLine);
    }
    
    writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`Fixed: ${filePath}`);
    fixed++;
  }
}

console.log(`\nDone! Fixed ${fixed} files.`);

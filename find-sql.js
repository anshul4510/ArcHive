import fs from 'fs';
import path from 'path';

function findSqlFiles(dir, depth = 0) {
  if (depth > 3) return;
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file === 'node_modules' || file === '.git' || file === '.gemini') continue;
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findSqlFiles(fullPath, depth + 1);
      } else if (file.endsWith('.sql')) {
        console.log("Found SQL file:", fullPath);
      }
    }
  } catch (e) {
    // Ignore access errors
  }
}

console.log("Searching c:\\Users\\DELL\\Desktop for SQL files...");
findSqlFiles("c:\\Users\\DELL\\Desktop");
console.log("Searching c:\\Users\\DELL\\Desktop\\ArcHive for SQL files...");
findSqlFiles("c:\\Users\\DELL\\Desktop\\ArcHive");

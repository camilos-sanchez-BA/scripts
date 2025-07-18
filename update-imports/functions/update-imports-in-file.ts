import * as fs from "fs";
import * as path from "path";
import { ImportMap } from "../interfaces/import-map";
export function updateImportsInFile(
  filepath: string,
  importMap: ImportMap
): boolean {
  let content = fs.readFileSync(filepath, "utf8");
  let newContent = content;
  let changesMade = false;

  for (const oldSpecifier in importMap) {
    const newSpecifier = importMap[oldSpecifier];
    // Regex to find import/require statements with the old specifier
    // This covers:
    // - import ... from 'old-specifier';
    // - import ... from "old-specifier";
    // - require('old-specifier');
    // - require("old-specifier");
    // It uses a non-greedy match for the content before 'from'/'require'
    // and captures the quote type in group 2.
    const escapedOldSpecifier = oldSpecifier.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    ); // Escape regex special chars
    const pattern = new RegExp(
      `(import\\s+.*?from\\s+|require\\s*\\()\\s*(['"])(${escapedOldSpecifier})\\2`,
      "g"
    );

    if (newContent.match(pattern)) {
      newContent = newContent.replace(pattern, `$1$2${newSpecifier}$2`);
      if (newContent !== content) {
        // Check if actual change occurred
        changesMade = true;
        console.log(
          `    - Updated '${oldSpecifier}' to '${newSpecifier}' in ${path.basename(
            filepath
          )}`
        );
        content = newContent; // Update content for subsequent replacements in the same file
      }
    }
  }

  if (changesMade) {
    fs.writeFileSync(filepath, newContent, "utf8");
    return true;
  }
  return false;
}

import * as fs from "fs";
import * as path from "path";

export function updateImportsInFile(
  filepath: string,
  importMap: string
): boolean {
  let content = fs.readFileSync(filepath, "utf8");
  let newContent = content;
  let changesMade = false;

  // --- Custom logic for import migration ---
  // 1. Find all import statements from core and components
  const coreImportRegex =
    /import\s*{([^}]+)}\s*from\s*['"]@britishairways-nexus\/nx-lib-design-system-core['"];?/g;
  const componentsImportRegex =
    /import\s*{([^}]+)}\s*from\s*['"]@britishairways-nexus\/nx-lib-design-system-components['"];?/g;

  let coreMatch = coreImportRegex.exec(content);
  let componentsMatch = componentsImportRegex.exec(content);

  let coreImports: string[] = [];
  let componentsImports: string[] = [];

  if (coreMatch) {
    coreImports = coreMatch[1]
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
  }
  if (componentsMatch) {
    componentsImports = componentsMatch[1]
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
  }

  // If import is in core, move it to components
  if (coreImports.includes(importMap)) {
    // Remove import from core
    coreImports = coreImports.filter((i) => i !== importMap);
    // Add import to components
    if (!componentsImports.includes(importMap)) {
      componentsImports.push(importMap);
    }
    changesMade = true;
  }

  // Rebuild import statements if changes were made
  if (changesMade) {
    // Remove old imports
    newContent = newContent.replace(
      coreImportRegex,
      coreImports.length > 0
        ? `import { ${coreImports.join(
            ", "
          )} } from "@britishairways-nexus/nx-lib-design-system-core";`
        : ""
    );
    newContent = newContent.replace(
      componentsImportRegex,
      componentsImports.length > 0
        ? `import { ${componentsImports.join(
            ", "
          )} } from "@britishairways-nexus/nx-lib-design-system-components";`
        : ""
    );
    // If no components import existed, add one
    if (!componentsMatch && componentsImports.length > 0) {
      newContent =
        `import { ${componentsImports.join(
          ", "
        )} } from "@britishairways-nexus/nx-lib-design-system-components";\n` +
        newContent;
    }
    fs.writeFileSync(filepath, newContent, "utf8");
    console.log(`    - Migrated CarrierIcons in ${path.basename(filepath)}`);
    return true;
  }

  if (changesMade) {
    fs.writeFileSync(filepath, newContent, "utf8");
    return true;
  }
  return false;
}

import * as fs from "fs";
import * as path from "path";
export function* walkDir(dir: string, extensions: string[]): Generator<string> {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file === "node_modules" || file === ".git") {
        continue; // Skip these directories
      }
      yield* walkDir(filePath, extensions); // Recurse into subdirectories
    } else if (extensions.some((ext) => filePath.endsWith(ext))) {
      yield filePath;
    }
  }
}

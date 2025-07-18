import * as fs from "fs";
import * as path from "path";

export function findNextjsProjects(baseDir: string): string[] {
  const projectPaths: string[] = [];
  console.log(`Searching for Next.js projects in: ${path.resolve(baseDir)}`);
  const projectPath = path.join(baseDir);

  if (fs.statSync(projectPath).isDirectory()) {
    const packageJsonPath = path.join(projectPath, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      try {
        const content = fs.readFileSync(packageJsonPath, "utf8");
        if (content.includes('"next"')) {
          // Simple check for 'next' dependency
          projectPaths.push(projectPath);
          console.log(`  Found Next.js project: `);
        }
      } catch (e) {
        console.error(`  Could not read package.json:`, e);
      }
    }
  }

  return projectPaths;
}

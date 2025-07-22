import { execSync } from "child_process";
import { existsSync } from "fs";
/**
 * Clones a Git repository into a specified target directory and runs 'npm run init-all' if package.json exists.
 *
 * @param repoUrl - The URL of the repository to clone.
 * @param targetDir - The directory where the repository should be cloned.
 */
export function cloneRepo(repoUrl: string, targetDir: string): void {
  console.log(`Cloning ${repoUrl} into ${targetDir} ...`);
  execSync(`git clone ${repoUrl} ${targetDir}`, { stdio: "inherit" });
  const pkgPath = `${targetDir}/package.json`;
  if (existsSync(pkgPath)) {
    console.log(`Running 'npm run init-all' in ${targetDir} ...`);
    execSync("npm run init-all", { cwd: targetDir, stdio: "inherit" });
  } else {
    console.log(
      `No package.json found in ${targetDir}. Skipping 'npm run init-all'.`
    );
  }
}

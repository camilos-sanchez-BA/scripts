import { execSync } from "child_process";
/**
 * Clones a Git repository into a specified target directory.
 *
 * @param repoUrl - The URL of the repository to clone.
 * @param targetDir - The directory where the repository should be cloned.
 */
export function cloneRepo(repoUrl: string, targetDir: string): void {
  console.log(`Cloning ${repoUrl} into ${targetDir} ...`);
  execSync(`git clone ${repoUrl} ${targetDir}`, { stdio: "inherit" });
}

import { Octokit } from "@octokit/rest";
import { walkDir } from "./walk-dir";
import { updateImportsInFile } from "./update-imports-in-file";
import { runGitCommand } from "./run-git-command";
import { ImportMap } from "../interfaces/import-map";
import * as path from "path";
import {
  FILE_EXTENSIONS,
  GIT_BRANCH_PREFIX,
  GIT_COMMIT_MESSAGE,
  PR_TITLE_PREFIX,
} from "../config/config";

export async function processProject(
  projectPath: string,
  importMap: ImportMap
): Promise<boolean> {
  const projectOriginalCwd = process.cwd(); // Store original CWD
  process.chdir(projectPath); // Change CWD to the project directory

  const project_name = path.basename(projectPath);
  console.log(`\n--- Processing Project: ${project_name} (${projectPath}) ---`);

  // 1. Find and update source files
  let modifiedFilesCount = 0;
  const sourceFiles: string[] = Array.from(walkDir(".", FILE_EXTENSIONS)); // Pass '.' as current dir
  console.log(`  Found ${sourceFiles.length} source files.`);

  for (const filePath of sourceFiles) {
    if (updateImportsInFile(filePath, importMap)) {
      modifiedFilesCount++;
    }
  }

  if (modifiedFilesCount === 0) {
    console.log(`  No import changes needed for ${project_name}.`);
    process.chdir(projectOriginalCwd); // Revert CWD
    return false;
  }

  console.log(`  ${modifiedFilesCount} files modified in ${project_name}.`);

  // 2. Git Operations
  let currentBranch;
  try {
    // Check if there are actual changes to commit
    const gitStatus = runGitCommand("status --porcelain", "."); // Use '.' as CWD is projectPath
    if (!gitStatus) {
      console.log(
        `  No pending changes after import update in ${project_name}. Skipping Git operations.`
      );
      process.chdir(projectOriginalCwd); // Revert CWD
      return false;
    }

    currentBranch = runGitCommand("rev-parse --abbrev-ref HEAD", ".");
    const newBranchName = `${GIT_BRANCH_PREFIX}${project_name
      .toLowerCase()
      .replace(/[\W_]+/g, "-")}`; // Sanitize branch name

    console.log(`  Creating new branch: ${newBranchName}`);
    runGitCommand(`checkout -b ${newBranchName}`, ".");

    console.log("  Staging changes...");
    runGitCommand("add .", ".");

    console.log("  Committing changes...");
    runGitCommand(`commit -m "${GIT_COMMIT_MESSAGE}"`, ".");

    console.log(`  Pushing branch to origin/${newBranchName}...`);
    runGitCommand(`push --set-upstream origin ${newBranchName}`, ".");
    console.log(`  Branch '${newBranchName}' pushed successfully.`);

    // 3. Create Pull Request (Placeholder)
    console.log("\n  --- Pull Request Creation ---");
    console.log(
      "  To create a Pull Request, you would typically use your Git hosting service's API."
    );
    console.log(
      `  For GitHub, you can use \`gh pr create\` CLI or the @octokit/rest library.`
    );
    console.log(
      `  Example: \`gh pr create --base main --head ${newBranchName} --title "${PR_TITLE_PREFIX}${project_name}" --body "${GIT_COMMIT_MESSAGE}"\``
    );
    console.log("  Please create the PR manually or integrate API calls here.");

    // // Example using @octokit/rest (requires 'npm install @octokit/rest' and a GitHub token)
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Set this environment variable
    if (GITHUB_TOKEN) {
      const octokit = new Octokit({ auth: GITHUB_TOKEN });
      try {
        // You'll need to determine the owner and repo name dynamically.
        // A common way is to parse the remote 'origin' URL:
        const remoteUrl = runGitCommand("config --get remote.origin.url", ".");
        const match = remoteUrl.match(/github\.com[:/](.*?)\/(.*?)(?:\.git)?$/);
        if (match) {
          const [, owner, repoName] = match;
          const pr = await octokit.pulls.create({
            owner,
            repo: repoName,
            title: `${PR_TITLE_PREFIX}${project_name}`,
            head: newBranchName,
            base: "main", // Or your default branch (e.g., "master", "develop")
            body: GIT_COMMIT_MESSAGE,
          });
          console.log(`  Pull Request created: ${pr.data.html_url}`);
        } else {
          console.log(
            "  Could not parse GitHub repository name from remote URL. Create PR manually."
          );
        }
      } catch (pr_e: any) {
        console.error(`  Error creating PR: ${pr_e.message || pr_e}`);
        console.log("  Please create the PR manually.");
      }
    } else {
      console.log(
        "  GITHUB_TOKEN environment variable not set. Cannot create PR programmatically."
      );
    }

    return true;
  } catch (e: any) {
    console.error(
      `  Error during Git operations for ${project_name}:`,
      e.message || e
    );
    console.log(`  Please check ${projectPath} and resolve manually.`);
    // Attempt to revert to original branch if possible
    try {
      runGitCommand(`checkout ${currentBranch}`, ".");
      console.log(`  Reverted to branch: ${currentBranch}`);
    } catch (revert_e) {
      // Ignore if checkout also fails
    }
    return false;
  } finally {
    process.chdir(projectOriginalCwd); // Ensure we always revert CWD
  }
}

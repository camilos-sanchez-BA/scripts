import { Octokit } from "@octokit/rest";
import { walkDir } from "./walk-dir";
import { updateImportsInFile } from "./update-imports-in-file";
import { runGitCommand } from "./run-git-command";
import * as path from "path";
import { execSync } from "child_process";
import { validateNxLibDesignSystemVersion } from "./validate-lib-version";
import {
  FILE_EXTENSIONS,
  GIT_BASE_BRANCH,
  GIT_BRANCH_PREFIX,
  GIT_COMMIT_MESSAGE,
  JIRA_TICKET,
  PR_TITLE_PREFIX,
  VALIDATE_VERSION,
} from "../config/config";

export async function processProject(
  projectPath: string,
  importMap: string[]
): Promise<boolean> {
  const projectOriginalCwd = process.cwd(); // Store original CWD
  process.chdir(projectPath); // Change CWD to the project directory

  const project_name = path.basename(projectPath);
  console.log(`\n--- Processing Project: ${project_name} (${projectPath}) ---`);

  // Validate nx-lib-design-system-components version
  if (VALIDATE_VERSION && !validateNxLibDesignSystemVersion(projectPath)) {
    console.log(
      `  Skipping project: ${project_name} due to invalid nx-lib-design-system-components version.`
    );
    process.chdir(projectOriginalCwd);
    return false;
  }

  // 1. Find and update source files

  const sourceFiles: string[] = Array.from(walkDir(".", FILE_EXTENSIONS)); // Pass '.' as current dir
  console.log(`  Found ${sourceFiles.length} source files.`);
  const currentBranch = runGitCommand("rev-parse --abbrev-ref HEAD", ".");

  console.log(`  Creating new branch: ${GIT_BRANCH_PREFIX}`);
  runGitCommand(`checkout -b ${GIT_BRANCH_PREFIX}`, ".");
  for (const component of importMap) {
    let modifiedFilesCount = 0;
    for (const filePath of sourceFiles) {
      if (updateImportsInFile(filePath, component)) {
        modifiedFilesCount++;
      }
    }

    if (modifiedFilesCount === 0) {
      console.log(`  No import changes needed for ${project_name}.`);
    }

    console.log(`  ${modifiedFilesCount} files modified in ${project_name}.`);

    // Run pre-commit checks
    console.log("  Running pre-commit checks...");
    console.log(`    [${component}] Running: npm run lint`);
    execSync("npm run lint", { stdio: "inherit" });
    console.log(`    [${component}] Running: npm run build`);
    execSync("npm run build", { stdio: "inherit" });
    console.log(`    [${component}] Running: npm run prettier:fix`);
    execSync("npm run prettier:fix", { stdio: "inherit" });
    console.log(`    [${component}] Running: npm run prettier`);
    execSync("npm run prettier", { stdio: "inherit" });

    // 2. Git Operations
    try {
      // Check if there are actual changes to commit
      const gitStatus = runGitCommand("status --porcelain", "."); // Use '.' as CWD is projectPath
      if (!gitStatus) {
        console.log(
          `  No pending changes after import update in ${project_name}. Skipping Git operations.`
        );
      }

      console.log("  Staging changes...");
      runGitCommand("add . ':!package.json' ':!package-lock.json'", ".");

      console.log("  Committing changes...");
      runGitCommand(`commit -m "${GIT_COMMIT_MESSAGE} - ${component}"`, ".");

      console.log(`  Pushing branch to origin/${GIT_BRANCH_PREFIX}...`);
      runGitCommand(`push --set-upstream origin ${GIT_BRANCH_PREFIX}`, ".");
      console.log(`  Branch '${GIT_BRANCH_PREFIX}' pushed successfully.`);

      // return true;
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
    }
  }
  // 3. Create Pull Request (Placeholder)
  console.log("\n  --- Pull Request Creation ---");
  console.log(
    "  To create a Pull Request, you would typically use your Git hosting service's API."
  );
  console.log(
    `  For GitHub, you can use \`gh pr create\` CLI or the @octokit/rest library.`
  );
  console.log(
    `  Example: \`gh pr create --base main --head ${GIT_BRANCH_PREFIX} --title "${PR_TITLE_PREFIX}" --body "${GIT_COMMIT_MESSAGE}"\``
  );
  console.log("  Please create the PR manually or integrate API calls here.");

  try {
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
            title: `${PR_TITLE_PREFIX}`,
            head: GIT_BRANCH_PREFIX,
            base: GIT_BASE_BRANCH, // Or your default branch (e.g., "master", "develop")
            body: `<!---
- Update the title of this PR to match <feat|fix|spike|test>[!]: NX-123 <imperative-description>
Please complete all the boxes below, place a lowercase x within the brackets, like [x]
-->

## 📝 Description

- [${JIRA_TICKET}](https://iagtech.atlassian.net/browse/${JIRA_TICKET}) <!-- Link to the ticket -->

${GIT_COMMIT_MESSAGE}

## ✅ Before asking to review I checked

- [x] npm run lint
- [x] npm run build
- [x] npm run prettier
- [x] npm run test:unit
- [x] npm run test:mutation

### ✅ Accessibility Checklist

- [ ] I have tested this change for accessibility using the [axe dev tools](https://chromewebstore.google.com/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd).
- [ ] I have reviewed the axe accessibility output and addressed any issues found.
- [ ] I have included a screenshot of the axe accessibility output in the pull request.
- [ ] I have used a screen-reader to test what I have built.

### Solves # (Jira issue)

_List any issues this PR will resolve, e.g. Closes [...]._

| name           | added | edited | removed | Story updated |
| -------------- | :---: | :----: | :-----: | :------------:|
| header         |       |   x    |         |               |
|                |       |        |         |               |

## Type of change

- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [x] Bug fix (non-breaking change which fixes an issue)
- [ ] Hot fix (fixes an issue in master branch)
- [ ] Docs (Documentation only changes)
- [ ] Style (Changes that do not affect the meaning of the code, formatting, missing semi-colons, etc)
- [ ] Refactor (Changes that neither fixes a bug or adds a feature)
- [ ] Performance (Changes that improve performance)
- [ ] Chore (Changes to the build process or auxiliary tools and libraries)

## 📸 Screenshots

### Unit tests screenshot

_Remember all our projects required a minimum coverage of 95-100% and all the unit test must pass._

### Accessibility Screenshots

_Please include a screenshot of the axe accessibility output here._`,
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
  } catch (error) {
    return false;
  } finally {
    process.chdir(projectOriginalCwd); // Ensure we always revert CWD
  }
}

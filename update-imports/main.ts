import * as fs from "fs";
import * as path from "path";

import "dotenv/config";
import { GITHUB_PROJECTS, IMPORT_PATH_MAP } from "./config/config";
import { getRepoNameFromUrl } from "./functions/get-repo-name-from-url";
import { cloneRepo } from "./functions/clone-repo";
import { findNextjsProjects } from "./functions/find-next-projects";
import { processProject } from "./functions/process-project";

// --- New: Directory for Cloned Repos ---
const CLONE_BASE_DIR = path.resolve("./cloned-repos");
if (!fs.existsSync(CLONE_BASE_DIR)) {
  fs.mkdirSync(CLONE_BASE_DIR);
}

// --- Script Logic ---

async function main() {
  console.log("Starting automated import update and PR creation script...");

  let allProjects: string[] = [];

  // --- New: Clone GitHub Repos and Collect Project Paths ---
  for (const repoUrl of GITHUB_PROJECTS) {
    const repoName = getRepoNameFromUrl(repoUrl);
    const targetDir = path.join(CLONE_BASE_DIR, repoName);
    if (!fs.existsSync(targetDir)) {
      try {
        cloneRepo(repoUrl, targetDir);
      } catch (e) {
        console.error(`Failed to clone ${repoUrl}:`, e);
        continue;
      }
    }
    // Find Next.js projects in the cloned repo
    const foundProjects = findNextjsProjects(targetDir);
    allProjects.push(...foundProjects);
  }

  if (allProjects.length === 0) {
    console.log(`No Next.js projects found in cloned repositories. Exiting.`);
    return;
  }

  console.log(`\nFound ${allProjects.length} Next.js projects to process.`);

  let totalPrsInitiated = 0;
  for (const projectPath of allProjects) {
    const prCreated = await processProject(projectPath, IMPORT_PATH_MAP);
    if (prCreated) {
      totalPrsInitiated++;
    }
  }

  console.log(`\n--- Script Finished ---`);
  console.log(`Total projects processed: ${allProjects.length}`);
  console.log(
    `Total Pull Requests initiated (branches pushed): ${totalPrsInitiated}`
  );
  console.log(
    "Please review the created branches and open Pull Requests on your Git hosting platform."
  );
}

// Run the main function
main().catch(console.error);

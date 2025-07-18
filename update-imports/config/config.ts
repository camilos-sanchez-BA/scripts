import { ImportMap } from "../interfaces/import-map";

// Define your import path mappings here.
export const IMPORT_PATH_MAP: ImportMap = {
  "./_components/user-profile": "./_components/user-profileV2",
  // Add more mappings as needed:
  // "old-path/utility": "new-path/shared-utility",
  // "another-old-lib/button": "design-system/button",
};

// The base directory where your Next.js projects are located.
// This script will look for subdirectories within this path.
export const BASE_PROJECTS_DIR = "./"; // Current directory, or specify a path like "./my-nextjs-apps"

// File extensions to process.
export const FILE_EXTENSIONS: string[] = [".ts", ".tsx", ".js", ".jsx"];

// Git branch name and commit message for the automated PR.
export const GIT_BRANCH_PREFIX = "fix/update-imports-";
export const GIT_COMMIT_MESSAGE = "fix: Update library import paths";
export const PR_TITLE_PREFIX = "fix: Update library imports for ";

// --- New: Array of GitHub Repositories to Process ---
export const GITHUB_PROJECTS: string[] = [
  "https://github.com/camilos-sanchez-BA/next-practice",
  // Add more repo URLs here
];

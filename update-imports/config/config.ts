// Define your import path mappings here.
export const IMPORT_PATH: string[] = [
  "Loading",
  "AirlineLogoLine",
  "DataStrip",
  "FareCard",
  "FlightBanner",
  "FlightDetailsSection",
  "PassengerCard",
];

// The base directory where your Next.js projects are located.
// This script will look for subdirectories within this path.
export const BASE_PROJECTS_DIR = "./"; // Current directory, or specify a path like "./my-nextjs-apps"

// File extensions to process.
export const FILE_EXTENSIONS: string[] = [".ts", ".tsx", ".js", ".jsx"];

// Git branch name and commit message for the automated PR.
export const JIRA_TICKET = "BB-67290";
export const GIT_BASE_BRANCH = "develop"; // Base branch for the PR
export const GIT_BRANCH_PREFIX = `fix/${JIRA_TICKET}-update-imports`;
export const GIT_COMMIT_MESSAGE = `fix(${JIRA_TICKET}): update library import paths`;
export const PR_TITLE_PREFIX = `fix(${JIRA_TICKET}): update library imports`;

// --- New: Array of GitHub Repositories to Process ---
export const GITHUB_PROJECTS: string[] = [
  "https://github.com/BritishAirways-Nexus/nx-ch-web-shared-components-playground",
  "https://github.com/BritishAirways-Nexus/nx-ch-web-customerhub",
  // Add more repo URLs here
];

// Minimum required version of the design system library.
export const DS_COMPONENTS_MIN_VERSION = "3.1.1";
export const VALIDATE_VERSION = true; // Set to false to skip version validation

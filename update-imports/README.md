# 🚀 Update Imports

A tool to automate updating import statements and creating pull requests across multiple repositories. Built with TypeScript for reliability and ease of use.

---

## ✨ Features

- Batch update import paths in your codebase
- Environment-based configuration
- Automated cloning and cleanup of repositories
- Pre-commit checks: lint, build, prettier
- Automated pull request creation (if GITHUB_TOKEN is set)
- Accessibility and testing checklist in PR body
- Easy setup and execution

---

## 📦 Prerequisites

- Node.js (v16+ recommended)
- npm
- TypeScript

---

## 🛠️ Installation

```bash
npm install
```

---

## ⚙️ Configuration

Edit `config/config.ts` to customize the tool:

- **IMPORT_PATH**: Array of component names to update imports for. Example:
  ```ts
  export const IMPORT_PATH: string[] = [
    "Loading",
    "AirlineLogoLine",
    "DataStrip",
    "FareCard",
    "FlightBanner",
    "FlightDetailsSection",
    "PassengerCard",
  ];
  ```
- **BASE_PROJECTS_DIR**: The base directory where your Next.js projects are located. Example:
  ```ts
  export const BASE_PROJECTS_DIR = "./"; // Or specify a custom path
  ```
- **FILE_EXTENSIONS**: File extensions to process. Example:
  ```ts
  export const FILE_EXTENSIONS: string[] = [".ts", ".tsx", ".js", ".jsx"];
  ```
- **JIRA_TICKET**: Jira ticket identifier for branch/commit/PR naming. Example:
  ```ts
  export const JIRA_TICKET = "BB-67290";
  ```
- **GIT_BASE_BRANCH**: Base branch for the PR. Example:
  ```ts
  export const GIT_BASE_BRANCH = "develop";
  ```
- **GIT_BRANCH_PREFIX**: Branch name prefix for automated PRs. Example:
  ```ts
  export const GIT_BRANCH_PREFIX = `fix/${JIRA_TICKET}-update-imports`;
  ```
- **GIT_COMMIT_MESSAGE**: Commit message for automated changes. Example:
  ```ts
  export const GIT_COMMIT_MESSAGE = `fix(${JIRA_TICKET}): update library import paths`;
  ```
- **PR_TITLE_PREFIX**: PR title prefix. Example:
  ```ts
  export const PR_TITLE_PREFIX = `fix(${JIRA_TICKET}): update library imports`;
  ```
- **GITHUB_PROJECTS**: Array of GitHub repository URLs to process. Example:
  ```ts
  export const GITHUB_PROJECTS: string[] = [
    "https://github.com/BritishAirways-Nexus/nx-ch-web-shared-components-playground",
    "https://github.com/BritishAirways-Nexus/nx-ch-web-customerhub",
    // Add more repo URLs here
  ];
  ```
- **DS_COMPONENTS_MIN_VERSION**: Minimum required version of the design system library. Example:
  ```ts
  export const DS_COMPONENTS_MIN_VERSION = "3.1.1";
  ```
- **VALIDATE_VERSION**: Set to `true` to enable version validation, or `false` to skip. Example:
  ```ts
  export const VALIDATE_VERSION = true;
  ```

Update these values in `config/config.ts` to fit your workflow and repositories.

---

## 🚀 Usage

Run the main script:

```bash
npm start
```

The script will:

- Clone all repositories listed in `GITHUB_PROJECTS` into a temporary `cloned-repos` directory
- Find Next.js projects and update import statements as configured
- Run pre-commit checks (`lint`, `build`, `prettier`)
- Create a new branch, commit, and push changes
- Attempt to create a pull request automatically if `GITHUB_TOKEN` is set, or provide manual instructions
- Clean up the `cloned-repos` directory after execution

---

## 📝 Troubleshooting

- Ensure all environment variables are set correctly.
- Check repository URLs for typos.
- If you encounter issues, run with verbose logging or check for TypeScript errors.
- Make sure your `GITHUB_TOKEN` has permission to create PRs if you want automated PR creation.

---

## 📚 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

MIT

# 🚀 Update Imports

A simple tool to automate updating import statements across multiple repositories. Built with TypeScript for reliability and ease of use.

---

## ✨ Features

- Batch update import paths in your codebase
- Environment-based configuration
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

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in the required environment variables in `.env` with your actual values.
3. Update repository URLs as needed in your configuration.

---

## 🔧 Configuration Options

You can customize the tool by editing `config/config.ts`:

- **IMPORT_PATH_MAP**: Map old import paths to new ones. Example:
  ```ts
  export const IMPORT_PATH_MAP = {
    "./_components/user-profile": "./_components/user-profileV2",
    // Add more mappings as needed
  };
  ```
- **BASE_PROJECTS_DIR**: Set the base directory for your Next.js projects. Example:
  ```ts
  export const BASE_PROJECTS_DIR = "./"; // Or specify a custom path
  ```
- **FILE_EXTENSIONS**: Specify which file extensions to process. Example:
  ```ts
  export const FILE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];
  ```
- **GIT_BRANCH_PREFIX**, **GIT_COMMIT_MESSAGE**, **PR_TITLE_PREFIX**: Customize git branch naming, commit messages, and PR titles for automated changes.
- **GITHUB_PROJECTS**: List the GitHub repository URLs to process. Example:
  ```ts
  export const GITHUB_PROJECTS = [
    "https://github.com/your-username/your-repo",
    // Add more repo URLs here
  ];
  ```

Update these values in `config/config.ts` to fit your workflow and repositories.

---

## 🚀 Usage

Run the main script:

```bash
npm start
```

---

## 📝 Troubleshooting

- Ensure all environment variables are set correctly.
- Check repository URLs for typos.
- If you encounter issues, run with verbose logging or check for TypeScript errors.

---

## 📚 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📧 Contact

For questions or support, contact the maintainer at [your-email@example.com].

---

## License

MIT

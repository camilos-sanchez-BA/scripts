import { execSync } from "child_process";

export function runGitCommand(command: string, cwd: string): string {
  console.log(`  Executing: git ${command}`);
  try {
    const output = execSync(`git ${command}`, { cwd, encoding: "utf8" });
    return output.trim();
  } catch (e: any) {
    console.error(`Error running Git command in ${cwd}: git ${command}`);
    console.error(`STDOUT: ${e.stdout}`);
    console.error(`STDERR: ${e.stderr}`);
    throw e;
  }
}

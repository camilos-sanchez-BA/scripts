import * as fs from "fs";
import * as path from "path";
import { DS_COMPONENTS_MIN_VERSION } from "../config/config";

/**
 * Validates that @britishairways-nexus/nx-lib-design-system-components version is >= 3.11.0
 * @param projectPath Path to the project root
 * @returns true if valid, false otherwise
 */
export function validateNxLibDesignSystemVersion(projectPath: string): boolean {
  const pkgPath = path.join(projectPath, "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.warn(`package.json not found in ${projectPath}`);
    return false;
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const version =
    (pkg.dependencies &&
      pkg.dependencies[
        "@britishairways-nexus/nx-lib-design-system-components"
      ]) ||
    (pkg.devDependencies &&
      pkg.devDependencies[
        "@britishairways-nexus/nx-lib-design-system-components"
      ]);
  if (!version) {
    console.warn(
      `@britishairways-nexus/nx-lib-design-system-components not found in dependencies.`
    );
    return false;
  }
  // Remove ^, ~, etc.
  const cleanVersion = version.replace(/^[^\d]*/, "");
  const [major, minor] = cleanVersion.split(".").map(Number);
  const [minMajor, minMinor] = DS_COMPONENTS_MIN_VERSION.split(".").map(Number);
  if (major > minMajor || (major === minMajor && minor >= minMinor)) {
    return true;
  }
  console.warn(
    `@britishairways-nexus/nx-lib-design-system-components version is ${cleanVersion}, must be >= ${DS_COMPONENTS_MIN_VERSION}.`
  );
  return false;
}

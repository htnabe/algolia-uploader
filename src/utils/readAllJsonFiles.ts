import fs from "node:fs";
import path from "node:path";

/**
 * Reads all JSON files from a specified directory and returns their parsed contents.
 *
 * @param {string} dataDir - The path to the directory containing JSON files.
 * @export
 * @returns {unknown[]} Parsed JSON values from matched files
 * @example
 * const jsonContents = readJsonFiles('./data');
 * console.log(jsonContents);
 */
export function readAllJsonFiles(dataDir: string): unknown[] {
  const files = fs.readdirSync(dataDir);
  return files
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const content = fs.readFileSync(path.join(dataDir, file), "utf8");
      return JSON.parse(content);
    });
}

/**
 * Expand an array of file or directory paths into a list of JSON file paths.
 * Relative paths are expected to be already resolved by the caller.
 */
export function expandPathsToJsonFiles(paths: string[]): string[] {
  const out = new Set<string>();
  for (const p of paths) {
    if (!fs.existsSync(p)) {
      throw new Error(`Path does not exist: ${p}`);
    }
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      const files = fs.readdirSync(p).filter((f) => f.endsWith(".json"));
      for (const f of files) {
        out.add(path.join(p, f));
      }
    } else if (stat.isFile() && p.endsWith(".json")) {
      out.add(p);
    }
  }
  return Array.from(out);
}

/**
 * Read JSON contents from a set of file or directory paths.
 */
export function readAllJsonFilesFromPaths(paths: string[]): unknown[] {
  const files = expandPathsToJsonFiles(paths);
  return files.map((fp) => JSON.parse(fs.readFileSync(fp, "utf8")));
}

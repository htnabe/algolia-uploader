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

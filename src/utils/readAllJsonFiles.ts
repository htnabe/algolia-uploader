import fs from "fs";
import path from "path";

/**
 * Reads all JSON files from a specified directory and returns their parsed contents.
 *
 * @param {string} dataDir - The path to the directory containing JSON files.
 * @export
 * @returns {any[]} The json content
 * @example
 * const jsonContents = readJsonFiles('./data');
 * console.log(jsonContents);
 */
export function readAllJsonFiles(dataDir: string): any[] {
  const files = fs.readdirSync(dataDir);
  return files
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const content = fs.readFileSync(path.join(dataDir, file), "utf8");
      return JSON.parse(content);
    });
}

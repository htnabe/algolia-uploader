import fs from "fs";
import path from "path";

/**
 * JSON File Reader
 *
 * Provides methods to read JSON files from a directory or a specific file.
 *
 * @export
 */
export class JsonFileReader {
  /**
   * Reads all JSON files from a specified directory and returns their parsed contents.
   *
   * @param {string} dirPath - The path to the directory containing JSON files.
   * @returns {any[]} The parsed JSON content from all files in the directory.
   * @throws {Error} If the directory does not exist or is not accessible.
   * @example
   * const jsonContents = JsonFileReader.readAllFromDir('./data');
   * console.log(jsonContents);
   */
  static readAllFromDir(dirPath: string): any[] | undefined {
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      console.error(`Error: provided directory does not exist - ${dirPath}`);
      return undefined;
    }

    return fs
      .readdirSync(dirPath)
      .filter((file) => file.endsWith(".json"))
      .map((file) => JsonFileReader.readFromFile(path.join(dirPath, file)));
  }

  /**
   * Reads a JSON file from a specified path and returns the parsed content.
   *
   * @param {string} filePath - The path to the JSON file.
   * @returns {any} The parsed JSON content.
   * @throws {Error} If the file does not exist, is not accessible, or is not a JSON file.
   * @example
   * const jsonContent = JsonFileReader.readFromFile('./data/example.json');
   * console.log(jsonContent);
   */
  static readFromFile(filePath: string): any | undefined {
    if (!filePath.endsWith(".json")) {
      console.error("Only JSON files are supported.");
      return undefined;
    }
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      console.error(`Invalid file: ${filePath}`);
      return undefined;
    }

    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  }
}

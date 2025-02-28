import fs from "fs";
import path from "path";
import { config } from "./config";

export function readJsonFiles(): any[] {
  if (config.DATA_DIR === undefined) {
    throw new Error("Provide valid directory name where json file exists");
  }
  const dataDir = path.join(__dirname, "..", config.DATA_DIR);
  const files = fs.readdirSync(dataDir);

  // CAUTION: currently only one json file is read in the later process
  return files
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const content = fs.readFileSync(path.join(dataDir, file), "utf8");
      return JSON.parse(content);
    });
}

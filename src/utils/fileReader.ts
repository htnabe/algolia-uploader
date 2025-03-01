import fs from "fs";
import path from "path";
import { ConfigProvider } from "./ConfigProvider";

export function readJsonFiles(): any[] {
  const config = ConfigProvider.getInstance();
  let dataDir = config.getConfig("DATA_DIR");

  dataDir = path.join(__dirname, "..", dataDir);
  const files = fs.readdirSync(dataDir);

  // CAUTION: currently only one json file is read in the later process
  return files
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const content = fs.readFileSync(path.join(dataDir, file), "utf8");
      return JSON.parse(content);
    });
}

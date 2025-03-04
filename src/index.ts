import { defineCommand, runMain } from "citty";
import { name, version, description } from "../package.json";
import { readAllJsonFiles } from "./utils/readAllJsonFiles";
import { uploadObjects } from "./uploader";
import { ConfigProvider } from "./utils/ConfigProvider";
import path from "path";
import { isIndexedItem } from "./types/IndexedItem";
import fs from "fs";

const main = defineCommand({
  meta: {
    name: name,
    version: version,
    description: description,
  },
  args: {},
  async run({ args }) {
    try {
      const config = ConfigProvider.getInstance();
      let dataDir = config.getConfig("DATA_DIR");
      dataDir = path.join(__dirname, "..", dataDir);
      const dirExists = fs.existsSync(dataDir) && fs.statSync(dataDir).isDirectory();

      // Check the directory
      if (!dirExists) {
        console.error(`Error: provided directory does not exist - ${dataDir}`);
        return;
      }

      const algoliaSourceObjects: any[] = readAllJsonFiles(dataDir)[0];

      // check the type
      const areObjsIndexedItems = algoliaSourceObjects.every(obj => isIndexedItem(obj));
      if (!areObjsIndexedItems) {
        console.error(`The content of the provided json file is incompatible. Check the file: ${dataDir}`);
        return;
      }

      await uploadObjects(algoliaSourceObjects);
    } catch (error) {
      console.error("Some errors occured: ", error);
      process.exit(1);
    }
  },
});

runMain(main);

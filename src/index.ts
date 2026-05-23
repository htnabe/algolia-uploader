#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { defineCommand, runMain } from "citty";
import { description, name, version } from "../package.json";
import { isIndexedItem } from "./types/IndexedItem";
import { AlgoliaClientProvider } from "./utils/AlgoliaClientProvider";
import { ConfigProvider } from "./utils/ConfigProvider";
import { readAllJsonFiles } from "./utils/readAllJsonFiles";
import { Uploader } from "./utils/Uploader";

const main = defineCommand({
  meta: {
    name: name,
    version: version,
    description: description,
  },
  args: {},
  async run() {
    try {
      const config = ConfigProvider.getInstance();
      let dataDir = config.getConfig("DATA_DIR");
      dataDir = path.join(process.cwd(), dataDir);
      const dirExists =
        fs.existsSync(dataDir) && fs.statSync(dataDir).isDirectory();

      // Check the directory
      if (!dirExists) {
        console.error(`Error: provided directory does not exist - ${dataDir}`);
        process.exit(1);
      }

      const allJsonContents = readAllJsonFiles(dataDir);
      const algoliaSourceObjects = allJsonContents[0];

      if (!Array.isArray(algoliaSourceObjects)) {
        console.error(
          `The content of the provided json file is incompatible. Check the file: ${dataDir}`,
        );
        process.exit(1);
      }

      // check the type
      const areObjsIndexedItems = algoliaSourceObjects.every((obj) =>
        isIndexedItem(obj),
      );
      if (!areObjsIndexedItems) {
        console.error(
          `The content of the provided json file is incompatible. Check the file: ${dataDir}`,
        );
        process.exit(1);
      }

      const provider = AlgoliaClientProvider.getInstance();
      const uploader = new Uploader(provider);
      await uploader.uploadObjects(algoliaSourceObjects);
    } catch (error) {
      console.error("Some errors occured: ", error);
      process.exit(1);
    }
  },
});

runMain(main);

#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import { name, version, description } from "../package.json";
import { ConfigProvider } from "./utils/ConfigProvider";
import path from "path";
import { isIndexedItem } from "./types/IndexedItem";
import fs from "fs";
import { Uploader } from "./utils/Uploader";
import { AlgoliaClientProvider } from "./utils/AlgoliaClientProvider";
import { JsonFileReader } from "./utils/JsonFileReader";
import { aL } from "vitest/dist/chunks/reporters.d.CqBhtcTq";

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
      let algoliaSourceObjects: any[];

      // DATA_DIR or FILE_PATH should not be blank
      if (dataDir !== "") {
        dataDir = path.join(process.cwd(), dataDir);
        const content = JsonFileReader.readAllFromDir(dataDir);
        if (content === undefined) {
          process.exit(1);
        }
        algoliaSourceObjects = content[0];
      } else {
        let filePath = config.getConfig("FILE_PATH");
        filePath = path.join(process.cwd(), filePath);
        const content = JsonFileReader.readFromFile(filePath);
        if (content === undefined) {
          process.exit(1);
        }
        algoliaSourceObjects = content;
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
      console.error(error);
      process.exit(1);
    }
  },
});

runMain(main);

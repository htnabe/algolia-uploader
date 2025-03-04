import { defineCommand, runMain } from "citty";
import { name, version, description } from "../package.json";
import { readAllJsonFiles } from "./utils/readAllJsonFiles";
import { uploadObjects } from "./uploader";
import { ConfigProvider } from "./utils/ConfigProvider";
import path from "path";
import { isIndexedItem } from "./types/IndexedItem";

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
      const algoliaSourceObjects: any[] = readAllJsonFiles(dataDir)[0];

      // check the type
      algoliaSourceObjects.forEach((obj: unknown) => {
        if (!isIndexedItem(obj)) {
          throw new Error(`The provided file's content is not compatible.`);
        }
      });

      await uploadObjects(algoliaSourceObjects);
    } catch (error) {
      console.error("Some errors occured: ", error);
      process.exit(1);
    }
  },
});

runMain(main);

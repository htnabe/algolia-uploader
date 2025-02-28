import { defineCommand, runMain } from "citty";
import { name, version, description } from "../package.json";
import { readJsonFiles } from "./utils/fileReader";
import { uploadObjects } from "./uploader";

const main = defineCommand({
  meta: {
    name: name,
    version: version,
    description: description,
  },
  args: {},
  async run({ args }) {
    try {
      // objects obtained from target json file
      const objects: any[] = readJsonFiles();
      // added/revised/removed items count
      await uploadObjects(objects[0]);
    } catch (error) {
      console.error("Some errors occured: ", error);
      process.exit(1);
    }
  },
});

runMain(main);

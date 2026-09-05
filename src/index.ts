#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineCommand, runMain } from "citty";
import { description, name, version } from "../package.json";
import { ConfigProvider } from "./utils/ConfigProvider";
import "@dotenvx/dotenvx/config";
import { showAuthors } from "./features/authors/showAuthors";
import { retrieveDataFromDir } from "./features/dataDir/retrieveDataFromDir";
import { retrieveDataFromFiles } from "./features/dataFiles/retrieveDataFromFiles";
import type IndexedItem from "./types/IndexedItem";
import { AlgoliaClientProvider } from "./utils/AlgoliaClientProvider";
import { Uploader } from "./utils/Uploader";

export const main = defineCommand({
  meta: {
    name: name,
    version: version,
    description: description,
  },
  args: {
    authors: {
      type: "boolean",
      description: "Show the authors of this package LMAO",
    },
    dataFiles: {
      type: "string",
      description:
        "Path(s) to JSON files. Provide multiple paths separated by spaces after --data-files.",
    },
  },
  async run({ args }) {
    try {
      validateCliArgs(args as Record<string, unknown>);

      if (args.authors) {
        showAuthors();
        return;
      }

      const positionalPaths = Array.isArray(args._) ? (args._ as string[]) : [];
      const fileList: string[] = [
        ...(args.dataFiles ? [args.dataFiles as string] : []),
        ...positionalPaths,
      ]
        .map((tmpPath) => tmpPath.trim())
        .filter((tmpPath) => tmpPath.length > 0);

      if (fileList.length > 0) {
        // Resolve paths to absolute and delegate to the dataFiles feature.
        const resolvedPaths: string[] = fileList.map((p) =>
          path.isAbsolute(p) ? p : path.resolve(process.cwd(), p),
        );

        const items = await retrieveDataFromFiles(resolvedPaths);

        if (Array.isArray(items) && items.length > 0) {
          await uploadData(items);
        }
        return;
      }

      // DATA_DIR will not be supported as of v0.0.22.
      let dataDir = ConfigProvider.getDeprecatedDataDir();
      if (!dataDir) {
        console.error(
          "Error: no data path provided. Use --data-files or set DATA_DIR env.",
        );
        process.exit(1);
      }

      // Warn if using deprecated DATA_DIR env
      if (ConfigProvider.isUsingDeprecatedDataDir()) {
        console.warn(
          "Deprecated: The DATA_DIR environment variable will not be supported as of v0.0.22.",
        );
      }

      // Resolve relative paths against process.cwd(); leave absolute paths unchanged.
      if (!path.isAbsolute(dataDir)) {
        dataDir = path.resolve(process.cwd(), dataDir);
      }

      // Delegate handling of the provided path to the feature module, then upload.
      const items = await retrieveDataFromDir(dataDir);
      if (Array.isArray(items) && items.length > 0) {
        await uploadData(items);
      }
    } catch (error) {
      console.error("Some errors occurred: ", error);
      process.exit(1);
    }
  },
});

const validateCliArgs = (args: Record<string, unknown>): void => {
  // citty mirrors each arg under both its camelCase name and kebab-case alias.
  const allowedArgs = new Set(["_", "authors", "dataFiles", "data-files"]);
  const unknownArgs = Object.keys(args).filter((arg) => !allowedArgs.has(arg));

  if (unknownArgs.length > 0) {
    throw new Error(`Unknown argument: --${unknownArgs[0]}`);
  }

  const hasPositionalArgs = Array.isArray(args._) && args._.length > 0;
  if (hasPositionalArgs && !args.dataFiles) {
    throw new Error(
      "Positional arguments are only supported as additional file paths after --data-files.",
    );
  }
};

// Only auto-run when this module is executed directly (not imported, e.g. in tests).
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  runMain(main);
}

const uploadData = async (items: IndexedItem[]) => {
  const provider = AlgoliaClientProvider.getInstance();
  const uploader = new Uploader(provider);
  await uploader.uploadObjects(items);
};

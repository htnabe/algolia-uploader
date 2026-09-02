import fs from "node:fs";
import {
  type default as IndexedItem,
  isIndexedItem,
} from "@/types/IndexedItem";

/**
 * Retrieve and parse IndexedItem objects from the specified JSON files.
 * @param filePaths Array of file paths to JSON files containing IndexedItem objects.
 * @returns Promise that resolves to an array of IndexedItem objects parsed from the provided files.
 */
export async function retrieveDataFromFiles(
  filePaths: string[],
): Promise<IndexedItem[]> {
  if (!Array.isArray(filePaths) || filePaths.length === 0) {
    console.error("Error: no files provided to handleDataFiles");
    process.exit(1);
  }

  const allJsonContents: unknown[] = [];

  for (const targetPath of filePaths) {
    const targetExists = fs.existsSync(targetPath);
    if (!targetExists) {
      console.error(`Error: provided file does not exist - ${targetPath}`);
      process.exit(1);
    }

    if (!fs.statSync(targetPath).isFile()) {
      console.error(`Error: provided path is not a file - ${targetPath}`);
      process.exit(1);
    }

    const content = fs.readFileSync(targetPath, "utf8");
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      console.error(
        `The content of the provided json file is incompatible. Check the file: ${targetPath}`,
      );
      process.exit(1);
    }

    allJsonContents.push(...parsed);
  }

  if (allJsonContents.length === 0) {
    console.error("Error: no items found in provided files");
    process.exit(1);
  }

  const isIndexedItems = allJsonContents.every((obj) => isIndexedItem(obj));

  if (!isIndexedItems) {
    console.error(
      "The content of the provided json files is incompatible. Check the files provided.",
    );
    process.exit(1);
  }

  return allJsonContents;
}

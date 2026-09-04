import fs from "node:fs";
import type IndexedItem from "@/types/IndexedItem";
import { isIndexedItem } from "@/types/IndexedItem";
import { readAllJsonFiles } from "@/utils/readAllJsonFiles";

/**
 * Read a directory or file path and return an array of validated IndexedItem objects.
 * Accepts a single file path (to a JSON file containing an array) or a directory
 * containing multiple JSON files. Uses `readAllJsonFiles` for directory reads.
 */
export async function retrieveDataFromDir(
  targetPath: string,
): Promise<IndexedItem[]> {
  if (!fs.existsSync(targetPath)) {
    console.error(`Error: provided path does not exist - ${targetPath}`);
    process.exit(1);
  }

  const stat = fs.statSync(targetPath);
  const allJsonContents: unknown[] = [];

  if (stat.isDirectory()) {
    const parsedFiles = readAllJsonFiles(targetPath);
    // Expect each file to contain an array of items
    for (const parsed of parsedFiles) {
      if (!Array.isArray(parsed)) {
        console.error(
          `The content of one or more json files in the provided directory is incompatible. Check the directory: ${targetPath}`,
        );
        process.exit(1);
      }
      allJsonContents.push(...parsed);
    }
  } else if (stat.isFile()) {
    const content = fs.readFileSync(targetPath, "utf8");
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      console.error(
        `The content of the provided json file is incompatible. Check the file: ${targetPath}`,
      );
      process.exit(1);
    }
    allJsonContents.push(...parsed);
  } else {
    console.error(
      `Error: provided path is not a file or directory - ${targetPath}`,
    );
    process.exit(1);
  }

  if (allJsonContents.length === 0) {
    console.error("Error: no items found in provided path");
    process.exit(1);
  }

  const ok = allJsonContents.every((obj) => isIndexedItem(obj));
  if (!ok) {
    console.error(
      "The content of the provided json files is incompatible. Check the files provided.",
    );
    process.exit(1);
  }

  return allJsonContents as IndexedItem[];
}

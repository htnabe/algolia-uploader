import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import type IndexedItem from "@/types/IndexedItem";
import { retrieveDataFromFiles } from "./retrieveDataFromFiles";

const tempDirs: string[] = [];

const validItem: IndexedItem = {
  objectID: "item-001",
  title: "Item 001",
};

const throwOnExit = (...args: Parameters<typeof process.exit>): never => {
  throw new Error(`process.exit:${args[0]}`);
};

const installExitTrap = () =>
  vi.spyOn(process, "exit").mockImplementation(throwOnExit);

const createTempDir = (): string => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "algolia-uploader-"));
  tempDirs.push(tempDir);
  return tempDir;
};

const writeJson = (
  dirPath: string,
  fileName: string,
  content: unknown,
): string => {
  const filePath = path.join(dirPath, fileName);
  fs.writeFileSync(filePath, JSON.stringify(content), "utf8");
  return filePath;
};

afterEach(() => {
  for (const dirPath of tempDirs) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
  tempDirs.length = 0;
});

describe("retrieveDataFromFiles", () => {
  it("returns merged items from multiple json files", async () => {
    const tempDir = createTempDir();
    const firstPath = writeJson(tempDir, "a.json", [validItem]);
    const secondItem: IndexedItem = { objectID: "item-002", title: "Item 002" };
    const secondPath = writeJson(tempDir, "b.json", [secondItem]);

    await expect(
      retrieveDataFromFiles([firstPath, secondPath]),
    ).resolves.toEqual([validItem, secondItem]);
  });

  it("exits when no files are provided", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    installExitTrap();

    await expect(retrieveDataFromFiles([])).rejects.toThrow("process.exit:1");
    expect(errorSpy).toHaveBeenCalledWith(
      "Error: no files provided to handleDataFiles",
    );
  });

  it("exits when a file does not exist", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    installExitTrap();

    await expect(
      retrieveDataFromFiles(["/tmp/does-not-exist.json"]),
    ).rejects.toThrow("process.exit:1");
    expect(errorSpy).toHaveBeenCalledWith(
      "Error: provided file does not exist - /tmp/does-not-exist.json",
    );
  });

  it("exits when the provided path is a directory", async () => {
    const tempDir = createTempDir();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    installExitTrap();

    await expect(retrieveDataFromFiles([tempDir])).rejects.toThrow(
      "process.exit:1",
    );
    expect(errorSpy).toHaveBeenCalledWith(
      `Error: provided path is not a file - ${tempDir}`,
    );
  });

  it("exits when a json file does not contain an array", async () => {
    const tempDir = createTempDir();
    const filePath = writeJson(tempDir, "items.json", validItem);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    installExitTrap();

    await expect(retrieveDataFromFiles([filePath])).rejects.toThrow(
      "process.exit:1",
    );
    expect(errorSpy).toHaveBeenCalledWith(
      `The content of the provided json file is incompatible. Check the file: ${filePath}`,
    );
  });

  it("exits when all files are empty", async () => {
    const tempDir = createTempDir();
    const filePath = writeJson(tempDir, "items.json", []);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    installExitTrap();

    await expect(retrieveDataFromFiles([filePath])).rejects.toThrow(
      "process.exit:1",
    );
    expect(errorSpy).toHaveBeenCalledWith(
      "Error: no items found in provided files",
    );
  });

  it("exits when any item is not a valid IndexedItem", async () => {
    const tempDir = createTempDir();
    const filePath = writeJson(tempDir, "items.json", [
      validItem,
      { title: "broken" },
    ]);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    installExitTrap();

    await expect(retrieveDataFromFiles([filePath])).rejects.toThrow(
      "process.exit:1",
    );
    expect(errorSpy).toHaveBeenCalledWith(
      "The content of the provided json files is incompatible. Check the files provided.",
    );
  });
});

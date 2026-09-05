import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import { readAllJsonFiles } from "@/utils/readAllJsonFiles";

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  tempDirs.length = 0;
});

describe("readAllJsonFiles", () => {
  test("returns an empty array when the directory has no files", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "algolia-uploader-"));
    tempDirs.push(tempDir);

    expect(readAllJsonFiles(tempDir)).toEqual([]);
  });

  test("reads and parses only json files", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "algolia-uploader-"));
    tempDirs.push(tempDir);

    fs.writeFileSync(
      path.join(tempDir, "products.json"),
      JSON.stringify([{ objectID: "prod_001" }]),
      "utf8",
    );
    fs.writeFileSync(path.join(tempDir, "README.txt"), "ignore", "utf8");

    const contents = readAllJsonFiles(tempDir);

    expect(contents).toHaveLength(1);
    expect(contents[0]).toEqual([{ objectID: "prod_001" }]);
  });

  test("returns an empty array when the directory only contains non-json files", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "algolia-uploader-"));
    tempDirs.push(tempDir);

    fs.writeFileSync(path.join(tempDir, "README.txt"), "ignore", "utf8");
    fs.writeFileSync(path.join(tempDir, "products.csv"), "id,name", "utf8");

    expect(readAllJsonFiles(tempDir)).toEqual([]);
  });

  test("reads and parses multiple json files", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "algolia-uploader-"));
    tempDirs.push(tempDir);

    fs.writeFileSync(
      path.join(tempDir, "products.json"),
      JSON.stringify([{ objectID: "prod_001" }]),
      "utf8",
    );
    fs.writeFileSync(
      path.join(tempDir, "authors.json"),
      JSON.stringify([{ objectID: "author_001" }]),
      "utf8",
    );

    expect(readAllJsonFiles(tempDir)).toEqual([
      [{ objectID: "author_001" }],
      [{ objectID: "prod_001" }],
    ]);
  });

  test("throws when a json file has invalid format", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "algolia-uploader-"));
    tempDirs.push(tempDir);

    fs.writeFileSync(path.join(tempDir, "broken.json"), "{ invalid }", "utf8");

    expect(() => readAllJsonFiles(tempDir)).toThrow();
  });
});

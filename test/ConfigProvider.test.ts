import { describe, it, expect, beforeEach, vi } from "vitest";
import { ConfigProvider } from "../src/utils/ConfigProvider";

const dataDir = "data";
const filePath = "data/a.json";

describe("ConfigProvider", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.ALGOLIA_APP_ID = "test-app-id";
    process.env.ALGOLIA_ADMIN_API_KEY = "test-admin-key";
    process.env.ALGOLIA_INDEX_NAME = "test-index";
    process.env.DATA_DIR = dataDir;
    process.env.FILE_PATH = filePath;
  });

  it("should return a singleton instance", () => {
    const instance1 = ConfigProvider.getInstance();
    const instance2 = ConfigProvider.getInstance();
    expect(instance1).toBe(instance2);
  });

  it("should load environment variables correctly", () => {
    const config = ConfigProvider.getInstance();
    expect(config.getConfig("ALGOLIA_APP_ID")).toBe("test-app-id");
    expect(config.getConfig("ALGOLIA_ADMIN_API_KEY")).toBe("test-admin-key");
    expect(config.getConfig("ALGOLIA_INDEX_NAME")).toBe("test-index");
    expect(config.getConfig("DATA_DIR")).toBe(dataDir);
    expect(config.getConfig("FILE_PATH")).toBe(filePath);
  });

  it("should throw an error if a required variable is missing", async () => {
    delete process.env.ALGOLIA_ADMIN_API_KEY;

    // Reset module to throw an error
    const { ConfigProvider } = await import("../src/utils/ConfigProvider");
    expect(() => ConfigProvider.getInstance()).toThrow(
      "Missing required environment variable: ALGOLIA_ADMIN_API_KEY",
    );
  });

  it("should throw an error if both DATA_DIR and FILE_PATH are missing", async () => {
    delete process.env.DATA_DIR;
    delete process.env.FILE_PATH;

    const { ConfigProvider } = await import("../src/utils/ConfigProvider");
    expect(() => ConfigProvider.getInstance()).toThrow(
      "Either DATA_DIR or FILE_PATH must be set.",
    );
  });

  it("should work when only FILE_PATH is defined", async () => {
    delete process.env.DATA_DIR;

    const { ConfigProvider } = await import("../src/utils/ConfigProvider");
    const config = ConfigProvider.getInstance();
    expect(config.getConfig("FILE_PATH")).toBe(filePath);
    expect(config.getConfig("DATA_DIR")).toBe("");
  });

  it("should work when only DATA_DIR is defined", async () => {
    delete process.env.FILE_PATH;

    const { ConfigProvider } = await import("../src/utils/ConfigProvider");
    const config = ConfigProvider.getInstance();
    expect(config.getConfig("DATA_DIR")).toBe(dataDir);
    expect(config.getConfig("FILE_PATH")).toBe("");
  });
});

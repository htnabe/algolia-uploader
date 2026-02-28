import { describe, it, expect, beforeEach, vi } from "vitest";
import { ConfigProvider } from "@/utils/ConfigProvider";

describe("ConfigProvider", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.ALGOLIA_APP_ID = "test-app-id";
    process.env.ALGOLIA_ADMIN_API_KEY = "test-admin-key";
    process.env.ALGOLIA_INDEX_NAME = "test-index";
    process.env.DATA_DIR = "/data";
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
    expect(config.getConfig("DATA_DIR")).toBe("/data");
  });

  it("should throw an error if a required variable is missing", async () => {
    delete process.env.ALGOLIA_ADMIN_API_KEY;

    // Reset module to throw an error
    const { ConfigProvider } = await import("../src/utils/ConfigProvider");
    expect(() => ConfigProvider.getInstance()).toThrow(
      "Missing required environment variable: ALGOLIA_ADMIN_API_KEY",
    );
  });
});

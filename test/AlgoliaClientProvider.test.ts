import { describe, it, expect, vi, beforeEach } from "vitest";
import { AlgoliaClientProvider } from "../src/utils/AlgoliaClientProvider";
import { ConfigProvider } from "../src/utils/ConfigProvider";
import { algoliasearch, SearchClient } from "algoliasearch";

// vars for mock
let mockConfigProvider: ConfigProvider;
let mockAlgoliaSearch: typeof algoliasearch;
let mockSearchClient: SearchClient;

beforeEach(() => {
  // Mock ConfigProvider
  mockConfigProvider = {
    getConfig: vi.fn((key: string) => {
      const mockConfig: Record<string, string> = {
        ALGOLIA_APP_ID: "mockAppId",
        ALGOLIA_ADMIN_API_KEY: "mockApiKey",
        ALGOLIA_INDEX_NAME: "mockIndex",
      };
      return mockConfig[key];
    }),
  } as unknown as ConfigProvider;

  mockSearchClient = {} as SearchClient;
  mockAlgoliaSearch = vi.fn(
    () => mockSearchClient,
  ) as unknown as typeof algoliasearch;
});

describe("AlgoliaClientProvider", () => {
  it("should create an Algolia client with correct credentials", () => {
    const provider = new AlgoliaClientProvider(
      mockConfigProvider,
      mockAlgoliaSearch,
    );

    expect(mockAlgoliaSearch).toHaveBeenCalledWith("mockAppId", "mockApiKey");
    expect(provider.getClient()).toBe(mockSearchClient);
  });

  it("should return the correct index name", () => {
    const provider = new AlgoliaClientProvider(
      mockConfigProvider,
      mockAlgoliaSearch,
    );

    expect(provider.getIndexName()).toBe("mockIndex");
  });

  it("should return the same instance for getInstance (singleton)", () => {
    const instance1 = AlgoliaClientProvider.getInstance();
    const instance2 = AlgoliaClientProvider.getInstance();

    expect(instance1).toBe(instance2);
  });
});

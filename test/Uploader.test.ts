import { describe, expect, test, vi, beforeEach } from "vitest";
import { SearchClient, BrowseResponse } from "algoliasearch";
import IndexedItem from "@/types/IndexedItem";
import { AlgoliaClientProvider } from "@/utils/AlgoliaClientProvider";
import { Uploader } from "@/utils/Uploader";

// Mocked class of algolia search client
class MockAlgoliaClient {
  browseObjects = vi.fn(
    async ({
      aggregator,
    }: {
      aggregator: (res: Partial<BrowseResponse>) => void;
    }) => {
      const mockResponse: Partial<BrowseResponse> = {
        hits: [],
      };
      aggregator(mockResponse as BrowseResponse);
    },
  );

  partialUpdateObjects = vi.fn(async () =>
    Promise.resolve([{ objectIDs: ["prod_001"] }]),
  );
  saveObjects = vi.fn(async () =>
    Promise.resolve([{ objectIDs: ["prod_001"] }]),
  );
  deleteObjects = vi.fn(async () =>
    Promise.resolve([{ objectIDs: ["prod_001"] }]),
  );
}

describe("Uploader", () => {
  let mockProvider: AlgoliaClientProvider;
  let mockClient: MockAlgoliaClient;
  let uploader: Uploader;

  beforeEach(() => {
    mockClient = new MockAlgoliaClient();
    mockProvider = {
      getClient: () => mockClient as unknown as SearchClient,
      getIndexName: () => "test_index",
    } as AlgoliaClientProvider;
    uploader = new Uploader(mockProvider);
  });

  // Add
  test("New objects are added", async () => {
    mockClient.browseObjects.mockImplementationOnce(async ({ aggregator }) => {
      aggregator({ hits: [] });
    });

    const newObjects: IndexedItem[] = [
      { objectID: "prod_001", name: "New Product", price: 100 },
    ];

    await uploader.uploadObjects(newObjects);
    expect(mockClient.saveObjects).toHaveBeenCalledTimes(1);
  });

  // Update
  test("Objects are updated", async () => {
    mockClient.browseObjects.mockImplementationOnce(async ({ aggregator }) => {
      aggregator({
        hits: [{ objectID: "prod_001", name: "Old Product", price: 90 }],
      });
    });

    const newObjs: IndexedItem[] = [
      { objectID: "prod_001", name: "Updated Product", price: 100 },
    ];

    await uploader.uploadObjects(newObjs);
    expect(mockClient.partialUpdateObjects).toHaveBeenCalledTimes(1);
  });

  // Delete
  test("Returns an error when newObjects is empty", async () => {
    const consoleErrorMock = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const newObjects: IndexedItem[] = [];
    await uploader.uploadObjects(newObjects);
    expect(consoleErrorMock).toHaveBeenCalledWith(
      "No items are included in the target JSON file. More than 1 item is necessary.",
    );
    consoleErrorMock.mockRestore();
  });

  test("Do nothing when all items are the same", async () => {
    mockClient.browseObjects.mockImplementationOnce(async ({ aggregator }) => {
      aggregator({
        hits: [{ objectID: "prod_001", name: "Same Product", price: 100 }],
      });
    });

    const newObjects: IndexedItem[] = [
      { objectID: "prod_001", name: "Same Product", price: 100 },
    ];

    await uploader.uploadObjects(newObjects);

    expect(mockClient.saveObjects).not.toHaveBeenCalled();
    expect(mockClient.partialUpdateObjects).not.toHaveBeenCalled();
    expect(mockClient.deleteObjects).not.toHaveBeenCalled();
  });
});

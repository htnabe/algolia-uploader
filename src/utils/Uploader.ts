import { BatchResponse, BrowseResponse, SearchClient } from "algoliasearch";
import IndexedItem, {
  isIndexedItem,
  normalizeIndexedItemArray,
} from "../types/IndexedItem";
import Operations from "../types/Operations";
import { AlgoliaClientProvider } from "./AlgoliaClientProvider";
import { isEqual } from "es-toolkit";

/**
 * Class responsible for uploading objects to Algolia.
 */
export class Uploader {
  private client: SearchClient;
  private indexName: string;

  /**
   * Creates an instance of `Uploader`.
   * @param {AlgoliaClientProvider} provider - The Algolia client provider instance.
   */
  constructor(provider: AlgoliaClientProvider) {
    this.client = provider.getClient();
    this.indexName = provider.getIndexName();
  }

  /**
   * Uploads objects to Algolia, performing add, update, or delete operations as necessary.
   * @param {IndexedItem[]} newObjects - The new objects to be uploaded.
   * @returns {Promise<number>} The number of updated or added objects.
   */
  public async uploadObjects(newObjects: IndexedItem[]) {
    if (newObjects.length === 0) {
      console.error(
        "No items are included in the target JSON file. More than 1 item is necessary.",
      );
      return;
    }

    let existingObjects = await this.getAllObjects();
    existingObjects = normalizeIndexedItemArray(existingObjects);
    const sortedNewObjs = normalizeIndexedItemArray(newObjects);
    const operations = this.determineOperations(existingObjects, sortedNewObjs);

    if (
      operations.update.length === 0 &&
      operations.add.length === 0 &&
      operations.delete.length === 0
    ) {
      console.log("No updates needed. All objects are up to date.");
      return;
    }

    // Update Operation
    if (operations.update.length > 0) {
      const res: BatchResponse[] = await this.client.partialUpdateObjects({
        indexName: this.indexName,
        objects: operations.update,
        createIfNotExists: true,
      });
      console.log(`Updated ${res[0].objectIDs.length} objects`);
    }

    // Add Operation
    if (operations.add.length > 0) {
      const res = await this.client.saveObjects({
        indexName: this.indexName,
        objects: operations.add,
      });
      console.log(`Added ${res[0].objectIDs.length} objects`);
    }

    // Delete Operation
    if (operations.delete.length > 0) {
      const targetIds = operations.delete.map((obj) => obj.objectID);
      const res: BatchResponse[] = await this.client.deleteObjects({
        indexName: this.indexName,
        objectIDs: targetIds,
      });
      console.log(`Deleted ${res[0].objectIDs.length} objects`);
    }
  }

  /**
   * Retrieves all existing objects from Algolia.
   * @returns {Promise<IndexedItem[]>} A list of all objects in the index.
   */
  private async getAllObjects(): Promise<IndexedItem[]> {
    const objects: IndexedItem[] = [];
    await this.client.browseObjects<IndexedItem>({
      indexName: this.indexName,
      aggregator: (res: BrowseResponse) => {
        if (Array.isArray(res.hits)) {
          res.hits.forEach((hit) => {
            if (isIndexedItem(hit)) {
              objects.push(hit);
            }
          });
        }
      },
    });
    return objects;
  }

  /**
   * Determines which objects need to be added, updated, or deleted.
   * @param {IndexedItem[]} existingObjects - The currently stored objects.
   * @param {IndexedItem[]} newObjects - The new objects to be compared.
   * @returns {Operations} The operations to be performed.
   */
  private determineOperations(
    existingObjects: IndexedItem[],
    newObjects: IndexedItem[],
  ): Operations {
    const existingObjectMap = new Map(
      existingObjects.map((obj) => [obj.objectID, obj]),
    );
    const newObjectMap = new Map(newObjects.map((obj) => [obj.objectID, obj]));
    const operations: Operations = {
      update: [],
      add: [],
      delete: [],
    };

    // Check for updates and new items
    for (const newObj of newObjects) {
      const existingObj = existingObjectMap.get(newObj.objectID);
      if (existingObj == undefined) {
        operations.add.push(newObj);
      } else if (!isEqual(existingObj, newObj)) {
        operations.update.push(newObj);
      }
    }

    // Check for deletions
    for (const existingObj of existingObjects) {
      if (!newObjectMap.has(existingObj.objectID)) {
        operations.delete.push(existingObj);
      }
    }

    return operations;
  }
}

import { BatchResponse, BrowseResponse, SearchClient } from "algoliasearch";
import IndexedItem, { isIndexedItem } from "./types/IndexedItem";
import Operations from "./types/Operations";
import isEqual from "./utils/isEqual";
import { AlgoliaClientProvider } from "./utils/AlgoliaClientProvider";

export async function uploadObjects(newObjects: IndexedItem[]) {
  const provider = AlgoliaClientProvider.getInstance();
  const client = provider.getClient();
  const indexName = provider.getIndexName();

  const existingObjects: IndexedItem[] = await getAllObjects(client, indexName);
  const operations: Operations = determineOperations(
    existingObjects,
    newObjects,
  );

  if (operations.update.length === 0 && operations.add.length === 0) {
    console.log("No updates needed. All objects are up to date.");
    return 0;
  }

  // Update Operation
  if (operations.update.length > 0) {
    const res = await client.partialUpdateObjects({
      indexName: indexName,
      objects: operations.update,
      createIfNotExists: true,
    });
    console.log(`Updated ${res.length} new objects`);
  }

  // Add operation
  if (operations.add.length > 0) {
    const res = await client.saveObjects({
      indexName: indexName,
      objects: operations.add,
    });
    console.log(`Added ${res.length} new objects`);
  }

  // Delete operation
  if (operations.delete.length > 0) {
    const targetIds: string[] = operations.delete.map(
      (value) => value.objectID,
    );
    const res: BatchResponse[] = await client.deleteObjects({
      indexName: indexName,
      objectIDs: targetIds,
    });
    console.log(`Deleted ${res.length} objects`);
  }
}

async function getAllObjects(
  client: SearchClient,
  indexName: string,
): Promise<IndexedItem[]> {
  const objects: IndexedItem[] = [];
  await client.browseObjects<IndexedItem>({
    indexName: indexName,
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

function determineOperations(
  existingObjects: IndexedItem[],
  newObjects: IndexedItem[],
): Operations {
  // objectID and contents set
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
      // Check if the objects are not equal
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

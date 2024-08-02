import { index } from './algoliaClient';
import IndexedItem from './types/IndexedItem';
import Operations from './types/Operations';
import isEqual from './utils/isEqual';

export async function uploadObjects(newObjects: IndexedItem[]) {
  const existingObjects: IndexedItem[] = await getAllObjects();
  const operations: Operations = determineOperations(existingObjects, newObjects);

  if (operations.update.length === 0 && operations.add.length === 0) {
    console.log('No updates needed. All objects are up to date.');
    return 0;
  }

  // Update Operation
  if (operations.update.length > 0) {
    const { objectIDs: addedIDs } = await index.saveObjects(operations.add);
    console.log(`Updated ${addedIDs.length} new objects`);
  }

  // Add operation
  if (operations.add.length > 0) {
    const { objectIDs: addedIDs } = await index.saveObjects(operations.add);
    console.log(`Added ${addedIDs.length} new objects`);
  }

  // Delete operation
  if (operations.delete.length > 0) {
    const targetIds: string[] = operations.delete.map(value => value.objectID);
    const { objectIDs: deletedIDs } = await index.deleteObjects(targetIds);
    console.log(`Deleted ${deletedIDs.length} objects`);
  }
}

async function getAllObjects(): Promise<IndexedItem[]> {
  const objects: IndexedItem[] = [];
  await index.browseObjects({
    batch: batch => {
      objects.push(...batch);
    }
  });
  return objects;
}

//
function determineOperations(existingObjects: IndexedItem[], newObjects: IndexedItem[]): Operations {
  // objectID and contents set
  const existingObjectMap = new Map(existingObjects.map(obj => [obj.objectID, obj]));
  const newObjectMap = new Map(newObjects.map(obj => [obj.objectID, obj]));
  const operations: Operations = {
    update: [],
    add: [],
    delete: []
  };

  // Check for updates and adds
  for (const newObj of newObjects) {
    const existingObj = existingObjectMap.get(newObj.objectID);
    if (existingObj == undefined) {
      operations.add.push(newObj);
    } else if (!isEqual(existingObj, newObj)) {  // Check if the objects are not equal
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

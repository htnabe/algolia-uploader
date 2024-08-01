import { index } from './algoliaClient';

export async function uploadObjects(newObjects: any[]): Promise<number> {
  try {
    const existingObjects = await getAllObjects();
    const operations = determineOperations(existingObjects, newObjects);

    if (operations.update.length === 0 && operations.add.length === 0) {
      console.log('No updates needed. All objects are up to date.');
      return 0;
    }

    let totalOperations: number = 0;

    // newObjectsとOperationsのデータを渡して、必要なデータのupdate, add, delete処理を行う
    if (operations.update.length > 0) {
      const { objectIDs: addedIDs } = await index.saveObjects(operations.add);
      console.log(`Added ${addedIDs.length} new objects`);
      totalOperations += addedIDs.length;
    }

    // Add operation
    if (operations.add.length > 0) {
      const { objectIDs: addedIDs } = await index.saveObjects(operations.add);
      console.log(`Added ${addedIDs.length} new objects`);
      totalOperations += addedIDs.length;
    }

    // Delete operation
    if (operations.delete.length > 0) {
      const { objectIDs: deletedIDs } = await index.deleteObjects(operations.delete);
      console.log(`Deleted ${deletedIDs.length} objects`);
      totalOperations += deletedIDs.length;
    }

    return totalOperations;
  } catch (error) {
    console.error("some error occured while uploading: ", error);
    throw error;
  }
}

async function getAllObjects(): Promise<any[]> {
  const objects: any[] = [];
  await index.browseObjects({
    batch: batch => {
      objects.push(...batch);
    }
  });
  return objects;
}

function determineOperations(existingObjects: any[], newObjects: any[]): Operations {
  const existingObjectMap = new Map(existingObjects.map(obj => [obj.objectID, obj]));
  const operations: Operations = {
    update: [],
    add: [],
    delete: []
  };

  for (const newObj of newObjects) {
    const existingObj = existingObjectMap.get(newObj.objectID);
    if (existingObj) {
      // オブジェクトが既に存在する場合、更新が必要かチェック
      if (!isEqual(existingObj, newObj)) {
        operations.update.push(newObj);
      }
    } else {
      // 新しいオブジェクトの場合、追加リストに入れる
      operations.add.push(newObj);
    }
  }

  return operations;
}

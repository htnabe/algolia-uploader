import { index } from './algoliaClient';

export async function uploadObjects(objects: any[]): Promise<number> {
  try {
    const { objectIDs } = await index.saveObjects(objects);
    return objectIDs.length;
  } catch (error) {
    console.error("some error occured while uploading: ", error);
    throw error;
  }
}

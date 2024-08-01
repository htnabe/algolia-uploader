import { readJsonFiles } from './fileReader';
import { uploadObjects } from './uploader';

async function main() {
  try {
    const objects = readJsonFiles();
    const uploadedCount = await uploadObjects(objects);
    console.log(`uploaded ${uploadedCount} objects successfully.`);
  } catch (error) {
    console.error('error occured: ', error);
    process.exit(1);
  }
}

main();

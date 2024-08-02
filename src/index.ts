#!/usr/bin/env node
import { readJsonFiles } from './utils/fileReader';
import { uploadObjects } from './uploader';

async function main() {
  try {
    // objects obtained from target json file
    const objects: any[] = readJsonFiles();
    // added/revised/removed items count
    await uploadObjects(objects[0]);
  } catch (error) {
    console.error('error occured: ', error);
    process.exit(1);
  }
}

main();

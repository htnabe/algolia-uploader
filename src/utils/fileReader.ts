import fs from 'fs';
import path from 'path';
import { config } from './config';

export function readJsonFiles(): any[] {
  const dataDir = path.join(__dirname, '..', config.DATA_DIR);
  const files = fs.readdirSync(dataDir);

  return files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
      return JSON.parse(content);
    });
}

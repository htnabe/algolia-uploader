import fs from 'fs';
import path from 'path';
import { readJsonFiles } from '../src/fileReader';

jest.mock('fs');
jest.mock('path');

describe('fileReader', () => {
  it('reads JSON files from the data directory', () => {
    const mockFiles = ['file1.json', 'file2.json', 'file3.txt'];
    const mockData = [{ id: 1 }, { id: 2 }];

    (fs.readdirSync as jest.Mock).mockReturnValue(mockFiles);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockData[0]));
    (path.join as jest.Mock).mockReturnValue('/mock/path');

    const result = readJsonFiles();

    expect(result).toEqual([mockData[0], mockData[0]]);
    expect(fs.readdirSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledTimes(2);
  });
});

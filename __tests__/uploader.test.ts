import { uploadObjects } from '../src/uploader';
import { index } from '../src/algoliaClient';

jest.mock('../src/algoliaClient');

describe('uploader', () => {
  it('uploads objects to Algolia', async () => {
    const mockObjects = [{ id: 1 }, { id: 2 }];
    const mockResponse = { objectIDs: ['1', '2'] };

    (index.saveObjects as jest.Mock).mockResolvedValue(mockResponse);

    const result = await uploadObjects(mockObjects);

    expect(result).toBe(2);
    expect(index.saveObjects).toHaveBeenCalledWith(mockObjects);
  });

  it('throws an error if upload fails', async () => {
    const mockObjects = [{ id: 1 }];
    const mockError = new Error('Upload failed');

    (index.saveObjects as jest.Mock).mockRejectedValue(mockError);

    await expect(uploadObjects(mockObjects)).rejects.toThrow('Upload failed');
  });
});

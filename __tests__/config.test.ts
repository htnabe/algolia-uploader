describe('config', () => {
  beforeEach(() => {
    // 環境変数をリセット
    jest.resetModules();
    process.env = {};
  });

  it('throws an error if required environment variables are missing', () => {
    expect(() => {
      require('../src/utils/config');
    }).toThrow();
  });

  it('loads environment variables correctly', () => {
    process.env.ALGOLIA_APP_ID = 'test-app-id';
    process.env.ALGOLIA_ADMIN_API_KEY = 'test-api-key';
    process.env.ALGOLIA_INDEX_NAME = 'test-index-name';
    process.env.DATA_DIR = 'test-data-dir';

    const { config: loadedConfig } = require('../src/utils/config');

    expect(loadedConfig).toEqual({
      ALGOLIA_APP_ID: 'test-app-id',
      ALGOLIA_ADMIN_API_KEY: 'test-api-key',
      ALGOLIA_INDEX_NAME: 'test-index-name',
      DATA_DIR: 'test-data-dir'
    });
  });
});

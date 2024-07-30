import algoliasearch from 'algoliasearch';
import { config } from './config';

export const client = algoliasearch(config.ALGOLIA_APP_ID, config.ALGOLIA_ADMIN_API_KEY);
export const index = client.initIndex(config.ALGOLIA_INDEX_NAME);

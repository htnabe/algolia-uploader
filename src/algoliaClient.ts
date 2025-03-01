import { algoliasearch } from "algoliasearch";
import { config } from "./utils/ConfigProvider";

export const client = algoliasearch(
  config.ALGOLIA_APP_ID,
  config.ALGOLIA_ADMIN_API_KEY,
);
export const indexName = config.ALGOLIA_INDEX_NAME;

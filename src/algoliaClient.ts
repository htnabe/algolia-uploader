import { algoliasearch } from "algoliasearch";
import { ConfigProvider } from "./utils/ConfigProvider";

const config = ConfigProvider.getInstance();

export const client = algoliasearch(
  config.getConfig("ALGOLIA_APP_ID"),
  config.getConfig("ALGOLIA_ADMIN_API_KEY"),
);
export const indexName = config.getConfig("ALGOLIA_INDEX_NAME");

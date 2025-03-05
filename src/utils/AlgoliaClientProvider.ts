import { SearchClient, algoliasearch } from "algoliasearch";
import { ConfigProvider } from "./ConfigProvider";

/**
 * Provides an Algolia search client.
 */
export class AlgoliaClientProvider {
  private static instance: AlgoliaClientProvider;
  private client: SearchClient;
  private indexName: string;

  /**
   * Creates an instance of `AlgoliaClientProvider`.
   * @param {ConfigProvider} configProvider - The config provider instance.
   * @param {(typeof algoliasearch)} algoliaSearchFn - The Algolia search function.
   */
  constructor(
    configProvider: ConfigProvider,
    algoliaSearchFn: typeof algoliasearch,
  ) {
    this.client = algoliaSearchFn(
      configProvider.getConfig("ALGOLIA_APP_ID"),
      configProvider.getConfig("ALGOLIA_ADMIN_API_KEY"),
    );
    this.indexName = configProvider.getConfig("ALGOLIA_INDEX_NAME");
  }

  /**
   * Gets a singleton instance of `AlgoliaClientProvider`.
   * @returns {AlgoliaClientProvider} The singleton instance.
   */
  public static getInstance(): AlgoliaClientProvider {
    if (!this.instance) {
      const config = ConfigProvider.getInstance();
      this.instance = new AlgoliaClientProvider(config, algoliasearch);
    }
    return this.instance;
  }

  /**
   * Gets the Algolia search client.
   * @returns {SearchClient} The Algolia search client instance.
   */
  public getClient(): SearchClient {
    return this.client;
  }

  /**
   * Gets the configured Algolia index name.
   * @returns {string} The Algolia index name.
   */
  public getIndexName(): string {
    return this.indexName;
  }
}

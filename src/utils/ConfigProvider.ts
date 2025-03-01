import dotenv from "dotenv";

dotenv.config();

// variable to make complementary works
const REQUIRED_ENV_VARS = {
  ALGOLIA_APP_ID: "ALGOLIA_APP_ID",
  ALGOLIA_ADMIN_API_KEY: "ALGOLIA_ADMIN_API_KEY",
  ALGOLIA_INDEX_NAME: "ALGOLIA_INDEX_NAME",
  DATA_DIR: "DATA_DIR",
} as const;

export class ConfigProvider {
  private static instance: ConfigProvider;
  private envVars: Record<keyof typeof REQUIRED_ENV_VARS, string>;

  private constructor() {
    this.envVars = {} as Record<keyof typeof REQUIRED_ENV_VARS, string>;

    Object.values(REQUIRED_ENV_VARS).forEach((varName) => {
      const value = process.env[varName];
      if (value == undefined) {
        throw new Error(`Missing required environment variable: ${varName}`);
      }
      this.envVars[varName as keyof typeof REQUIRED_ENV_VARS] = value;
    });
  }

  /**
   * Provides the instance if the instance already generated, if not, new one is generated.
   *
   * @public
   * @static
   * @returns {ConfigProvider} The singleton instance of ConfigProvider
   * @example
   * const configInstance = ConfigProvider.getInstance();
   */
  public static getInstance(): ConfigProvider {
    if (!ConfigProvider.instance) {
      ConfigProvider.instance = new ConfigProvider();
    }
    return ConfigProvider.instance;
  }

  /**
   * Get .env item with unique key.
   *
   * @public
   * @template {keyof typeof REQUIRED_ENV_VARS} K - The key type, which must be a key of REQUIRED_ENV_VARS
   * @param {K} key - The key to retrieve the configuration value
   * @returns {string} The configuration value associated with the given key
   * @example
   * // Assuming REQUIRED_ENV_VARS includes 'API_KEY'
   * const apiKey = configInstance.getConfig('API_KEY');
   */
  public getConfig<K extends keyof typeof REQUIRED_ENV_VARS>(key: K): string {
    return this.envVars[key];
  }
}

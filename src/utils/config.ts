import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['ALGOLIA_APP_ID', 'ALGOLIA_ADMIN_API_KEY', 'ALGOLIA_INDEX_NAME', 'DATA_DIR'];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

export const config = {
  ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID as string,
  ALGOLIA_ADMIN_API_KEY: process.env.ALGOLIA_ADMIN_API_KEY as string,
  ALGOLIA_INDEX_NAME: process.env.ALGOLIA_INDEX_NAME as string,
  DATA_DIR: process.env.DATA_DIR
};

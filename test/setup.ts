import { afterEach, beforeEach, vi } from "vitest";

beforeEach(() => {
  vi.stubEnv("ALGOLIA_APP_ID", "test-app-id");
  vi.stubEnv("ALGOLIA_ADMIN_API_KEY", "test-admin-key");
  vi.stubEnv("ALGOLIA_INDEX_NAME", "test-index");
  vi.stubEnv("DATA_DIR", "/data");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

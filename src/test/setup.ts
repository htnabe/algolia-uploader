import { afterEach, beforeEach, vi } from "vitest";

beforeEach(() => {
  vi.stubEnv("ALGOLIA_APP_ID", "test-app-id");
  vi.stubEnv("ALGOLIA_ADMIN_API_KEY", "test-admin-key");
  vi.stubEnv("ALGOLIA_INDEX_NAME", "test-index");
  // Prevent tests from exiting the process during negative-path tests.
  vi.spyOn(process, "exit").mockImplementation(((
    _code?: number,
  ) => {}) as never);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

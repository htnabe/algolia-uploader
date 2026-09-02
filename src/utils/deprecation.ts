export const DATA_DIR_DEPRECATION_MESSAGE =
  "Deprecated: The DATA_DIR environment variable will not be supported as of v0.0.22.";

/**
 * Write to stderr to make it visible in CI logs.
   Keep function small for easy reuse in tests.
   eslint-disable-next-line no-console
 */
export function warnDataDirDeprecated(): void {
  console.warn(DATA_DIR_DEPRECATION_MESSAGE);
}

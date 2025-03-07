import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  // If entries is not provided, will be automatically inferred from package.json
  entries: [
    // default
    "./src/index",
  ],

  rollup: {
    // output not only mjs but also cjs
    emitCJS: true,
    esbuild: { minify: true },
  },

  // Generates .d.ts declaration file
  declaration: true,

  // false if you don't want to make an error even when waring
  failOnWarn: false,
});

import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  platform: "node",
  target: "node22",
  outDir: "dist",
  clean: true,
  minify: true,
  // automatically export
  exports: true,
  dts: false,
  // optimize building speed
  treeshake: true,
  failOnWarn: true,
});

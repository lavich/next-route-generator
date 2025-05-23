import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/nextRoutePlugin.ts", "src/routeGenerator.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});

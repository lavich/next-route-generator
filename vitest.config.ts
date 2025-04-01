import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    includeSource: ["src/**/*.{js,ts}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
  define: {
    "import.meta.vitest": "undefined",
  },
});

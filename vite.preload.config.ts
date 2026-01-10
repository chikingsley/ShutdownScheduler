import path from "node:path";
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/preload.ts"),
      formats: ["cjs"],
      fileName: () => "preload.js",
    },
    rollupOptions: {
      external: ["electron"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

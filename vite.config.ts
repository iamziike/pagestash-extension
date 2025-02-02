import path from "path";
import react from "@vitejs/plugin-react";
import manifest from "./src/manifest.json";
import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  legacy: {
    skipWebSocketTokenCheck: true,
  },
});


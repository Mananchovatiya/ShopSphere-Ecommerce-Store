import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config - proxies /api to the Express backend during development
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/task-api": {
        target: "http://localhost:8000",
        rewrite: (path) => path.replace(/^\/task-api/, ""),
        changeOrigin: true,
      },
      "/user-api": {
        target: "http://localhost:8001",
        rewrite: (path) => path.replace(/^\/user-api/, ""),
        changeOrigin: true,
      },
    },
  },
  build: { outDir: "build" },
});

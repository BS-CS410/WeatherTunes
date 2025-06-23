import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    hmr: {
      // Prevent WebSocket connection issues during auth flows
      timeout: 30000,
      overlay: false, // Disable error overlay to prevent interference with auth
    },
    proxy: {
      "/api": {
        target: "https://api.spotify.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["**/*.otf"],
    exclude: ["*.mp4", "*.webm", "*.ogg"], // Don't optimize video files
  },
  build: {
    assetsInlineLimit: 0, // Don't inline any assets, copy them as files
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return "assets/[name]-[hash][extname]";

          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1].toLowerCase();

          // Handle video files
          if (["mp4", "webm", "ogg"].includes(ext)) {
            return `assets/videos/[name][extname]`; // Keep original filenames for videos
          }

          // Handle other assets
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },
  // Explicitly include video file types as assets
  assetsInclude: ["*.mp4", "*.webm", "*.ogg"],
});

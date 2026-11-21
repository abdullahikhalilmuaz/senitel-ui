import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://caus-backend.onrender.com",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "https://caus-backend.onrender.com",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});

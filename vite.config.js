import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/web_bis/",
  plugins: [react()],
  server: {
    port: 5173
  }
});

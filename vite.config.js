import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pkg from "./package.json" with { type: "json" };

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => {
  return {
    plugins: [react()],
    base: command === "serve" && !isPreview ? "/" : pkg.base
  };
});

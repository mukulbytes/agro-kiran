import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
  root: "src", // Set the root directory to the pages folder
  build: {
    outDir: "../../dist", // Adjust build output folder
  },
});

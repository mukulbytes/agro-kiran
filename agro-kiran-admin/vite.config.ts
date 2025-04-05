import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// List all HTML files that need to be built
const inputFiles = {
  index: "src/index.html",
  "admin-login": "src/admin-login.html",
  "admin-dashboard": "src/admin-dashboard.html",
  "admin-products": "src/admin-products.html",
  "admin-product-form": "src/admin-product-form.html",
  "admin-orders": "src/admin-orders.html"
};

export default defineConfig({
  plugins: [tailwindcss()],
  root: "src",
  base: "./",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: inputFiles
    }
  },
  server: {
    open: "/index.html"
  }
});

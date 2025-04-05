import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// List all HTML files that need to be built
const inputFiles = {
  index: "src/index.html",
  about: "src/about.html",
  contact: "src/contact.html",
  product: "src/product.html",
  shop: "src/shop.html",
  "order-confirmation": "src/order-confirmation.html",
  login: "src/login.html",
  signup: "src/signup.html",
  checkout: "src/checkout.html",
  profile: "src/profile.html",
  shipping: "src/shipping.html",
  payment: "src/payment.html",
  "order-tracking": "src/order-tracking.html",
  chat: "src/chat.html"
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
    },
    // Ensure assets are properly handled
    assetsDir: "assets",
    // Generate source maps for better debugging
    sourcemap: true
  },
  // Development server configuration
  server: {
    open: "/index.html",
    port: 3000
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['dayjs']
  }
});

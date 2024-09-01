import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  build: {
    // Ensure correct base URL
    base: "/",
  },
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import commonjs from "@vitejs/plugin-commonjs";

// export default defineConfig({
//   plugins: [react(), commonjs()],

// });

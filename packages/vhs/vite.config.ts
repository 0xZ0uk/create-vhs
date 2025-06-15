import vikeSolid from "vike-solid/vite";
import devServer from "@hono/vite-dev-server";
import { defineConfig } from "vite";
import vike from "vike/plugin";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    vike(),
    tailwindcss(),
    devServer({
      entry: "src/hono-entry.ts",
      exclude: [
        /^\/@.+$/,
        /.*\.(ts|tsx|vue)($|\?)/,
        /.*\.(s?css|less)($|\?)/,
        /^\/favicon\.ico$/,
        /.*\.(svg|png)($|\?)/,
        /^\/(public|assets|static)\/.+/,
        /^\/node_modules\/.*/,
      ],
      injectClientScript: false,
    }),
    vikeSolid(),
  ],
  build: {
    target: "es2022",
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  }
});

import { serveStatic } from 'hono/bun'
import { type Context, Hono } from "hono";
import { env } from "hono/adapter";
import { compress } from "hono/compress";

import app from "./hono-entry.js";

const envs = env<{ NODE_ENV?: string; PORT?: string }>({ env: {} } as unknown as Context<{
  Bindings: { NODE_ENV?: string; PORT?: string };
}>);

const staticApp = new Hono();

staticApp.use(compress());

staticApp.use(
  "/*",
  serveStatic({
    root: "./dist/client/",
  }),
);

if (!app) {
  throw new Error("Hono app is not defined. Please check your imports.");
}

staticApp.route("/", app);

const port = envs.PORT ? Number.parseInt(envs.PORT, 10) : 3000;

console.log(`Server listening on http://localhost:${port}`);

export default {
  fetch: staticApp.fetch,
  port: port,
}

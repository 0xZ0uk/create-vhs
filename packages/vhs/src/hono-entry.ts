import { createHandler } from "@universal-middleware/hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { trpcHandler } from "./server/trpc-handler";
import { vikeHandler } from "./server/vike-handler";

const app = new Hono();

app.use("*", cors());

app.use("/api/trpc/*", createHandler(trpcHandler)("/api/trpc"));

/**
 * Vike route
 *
 * @link {@see https://vike.dev}
 **/
app.all("*", createHandler(vikeHandler)());

export default app;

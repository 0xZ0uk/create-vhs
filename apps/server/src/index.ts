import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "@vhs/api";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors());

app.use(
	"/trpc/*",
	trpcServer({
		router: appRouter,
	}),
);

export default {
	fetch: app.fetch,
	port: 3002,
};

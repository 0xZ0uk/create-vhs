import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "@vhs/api";
import { createTRPCContext } from "@vhs/api/trpc";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono()
	.basePath("/api")
	.use(
		"*",
		cors({
			origin: ["http://localhost:3000", "http://localhost:3001"],
			credentials: true,
		}),
	)
	.use(
		"/trpc/*",
		trpcServer({
			router: appRouter,
			createContext: createTRPCContext,
		}),
	);

export type AppRouter = typeof appRouter;

export default {
	fetch: app.fetch,
	port: 3002,
};

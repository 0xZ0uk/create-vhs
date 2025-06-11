import {
	createTRPCClient,
	httpBatchStreamLink,
	loggerLink,
} from "@trpc/client";
import type { AppRouter } from "@vhs/api";

import SuperJSON from "superjson";

export const trpc = createTRPCClient<AppRouter>({
	links: [
		loggerLink({
			enabled: (op) =>
				process.env.NODE_ENV === "development" ||
				(op.direction === "down" && op.result instanceof Error),
		}),
		httpBatchStreamLink({
			transformer: SuperJSON,
			url: "http://localhost:3002/trpc",
			headers: () => {
				const headers = new Headers();
				headers.set("x-trpc-source", "nextjs-react");
				return headers;
			},
		}),
	],
});

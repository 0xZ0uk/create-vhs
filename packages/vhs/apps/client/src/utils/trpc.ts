import type { QueryClient } from "@tanstack/solid-query";
import type { QueryClientProvider } from "@tanstack/solid-query";

import {
	createTRPCClient,
	httpBatchStreamLink,
	loggerLink,
} from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@vhs/api";
import type { ParentProps } from "solid-js";

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
			// biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
			url: `http://localhost:3002/api/trpc`,
			headers: () => {
				const headers = new Headers();
				headers.set("x-trpc-source", "nextjs-react");
				return headers;
			},
		}),
	],
});

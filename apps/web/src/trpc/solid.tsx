import { type QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import {
	TRPCRequestOptions,
	createTRPCClient,
	createTRPCClientProxy,
	httpBatchLink,
	httpBatchStreamLink,
	loggerLink,
} from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@vhs/api";
import type { ParentProps } from "solid-js";

import SuperJSON from "superjson";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;

const getQueryClient = () => {
	if (typeof window === "undefined") {
		// Server: always make a new query client
		return createQueryClient();
	}
	// Browser: use singleton pattern to keep the same query client
	clientQueryClientSingleton ??= createQueryClient();

	return clientQueryClientSingleton;
};

export const api = createTRPCClient<AppRouter>({
	links: [
		loggerLink({
			enabled: (op) =>
				process.env.NODE_ENV === "development" ||
				(op.direction === "down" && op.result instanceof Error),
		}),
		httpBatchStreamLink({
			transformer: SuperJSON,
			// biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
			url: `http://localhost:3002/trpc`,
			headers: () => {
				const headers = new Headers();
				headers.set("x-trpc-source", "nextjs-react");
				return headers;
			},
		}),
	],
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCSolidProvider({ children }: ParentProps) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

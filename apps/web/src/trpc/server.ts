import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@vhs/api";
import SuperJSON from "superjson";

const getBaseUrl = () => {
	return "http://localhost:3002";
};

export const serverTrpc = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${getBaseUrl()}/trpc`,
			headers: {
				"Content-Type": "application/json",
			},
			transformer: SuperJSON,
		}),
	],
});

export const createCaller = () => {
	return serverTrpc;
};

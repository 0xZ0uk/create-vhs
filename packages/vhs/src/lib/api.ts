import type { AppRouter } from "@/server/api/root";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import SuperJSON from "superjson";

export const api = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url:
				typeof window === "undefined"
					? "http://localhost:3000/api/trpc"
					: "/api/trpc",
			transformer: SuperJSON,
		}),
	],
});

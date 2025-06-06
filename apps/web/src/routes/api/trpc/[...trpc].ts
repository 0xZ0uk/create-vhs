import type { APIEvent, ResponseStub } from "@solidjs/start/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@vhs/api";
import { createTRPCContext } from "@vhs/api/trpc";

const SERVER_URL = "http://localhost:3002";

const setCorsHeaders = (response: ResponseStub) => {
	response.headers.set("Access-Control-Allow-Origin", "*");
	response.headers.set("Access-Control-Request-Method", "*");
	response.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
	response.headers.set("Access-Control-Allow-Headers", "*");
};

export const OPTIONS = ({ response }: APIEvent) => {
	const res = new Response(null, {
		status: 204,
	});
	setCorsHeaders(res);
	return response;
};

const handler = async ({ request, response }: APIEvent) => {
	const res = await fetchRequestHandler({
		endpoint: `${SERVER_URL}/api/trpc`,
		router: appRouter,
		req: request,
		createContext: () => createTRPCContext({ req: request }),
		onError({ error, path }) {
			console.error(`>>> tRPC Error on '${path}'`, error);
		},
	});

	setCorsHeaders(res);
	return res;
};

export const GET = handler;
export const POST = handler;

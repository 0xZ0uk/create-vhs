import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../trpc";

export const vhsRouter = {
	hello: publicProcedure.query(() => {
		return {
			message: "Hello from VHS",
		};
	}),
} satisfies TRPCRouterRecord;

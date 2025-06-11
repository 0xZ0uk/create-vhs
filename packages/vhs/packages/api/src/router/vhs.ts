import type { TRPCRouterRecord } from "@trpc/server";

import z from "zod";
import { publicProcedure } from "../trpc";

export const vhsRouter = {
	hello: publicProcedure.query(() => {
		return {
			message: "Hello from VHS",
		};
	}),
	create: publicProcedure
		.input(z.object({ title: z.string() }))
		.mutation(({ input }) => {
			return {
				message: `Now playing: ${input.title}`,
			};
		}),
} satisfies TRPCRouterRecord;

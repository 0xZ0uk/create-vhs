import { vhsRouter } from "./router/vhs";
import { createCallerFactory, createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	vhs: vhsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

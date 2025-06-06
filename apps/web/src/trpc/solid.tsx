import {
	type QueryClient,
	QueryClientProvider,
	createMutation,
	createQuery,
	useQueryClient,
} from "@tanstack/solid-query";
import {
	type TRPCClientError,
	createTRPCUntypedClient,
	httpBatchLink,
	loggerLink,
} from "@trpc/client";
import type { AppRouter } from "@vhs/api";
import { type ParentComponent, createContext, useContext } from "solid-js";
import { createQueryClient } from "./query-client";

const getBaseUrl = () => {
	return "http://localhost:3002";
};

// Create the tRPC client
export const createTrpcClient = () => {
	return createTRPCUntypedClient({
		links: [
			loggerLink({
				enabled: (opts) =>
					process.env.NODE_ENV === "development" ||
					(opts.direction === "down" && opts.result instanceof Error),
			}),
			httpBatchLink({
				url: `${getBaseUrl()}/trpc`,
				headers() {
					return {
						"x-trpc-source": "solid",
						"Content-Type": "application/json",
					};
				},
				fetch(url, options) {
					return fetch(url, {
						...options,
						credentials: "include",
					});
				},
			}),
		],
	});
};

// Context for the tRPC client
const TRPCContext = createContext<ReturnType<typeof createTrpcClient>>();
const QueryClientContext = createContext<QueryClient>();

export const useTRPCClient = () => {
	const client = useContext(TRPCContext);
	if (!client) {
		throw new Error("useTRPCClient must be used within TrpcProvider");
	}
	return client;
};

export const useTRPCQueryClient = () => {
	const client = useContext(QueryClientContext);
	if (!client) {
		throw new Error("useTRPCQueryClient must be used within TrpcProvider");
	}
	return client;
};

// Helper to create typed tRPC queries and mutations
export const createTRPCHelpers = () => {
	const client = useTRPCClient();
	const queryClient = useTRPCQueryClient();

	const createTRPCQuery = <TInput = void, TOutput = unknown>(
		path: string,
		input?: () => TInput,
	) => {
		return createQuery(() => ({
			queryKey: input ? [path, input()] : [path],
			queryFn: async () => {
				const result = await client.query(path, input?.());
				return result as TOutput;
			},
		}));
	};

	const createTRPCMutation = <TInput = void, TOutput = unknown>(
		path: string,
		options?: () => {
			onSuccess?: (data: TOutput) => void;
			onError?: (error: TRPCClientError<AppRouter>) => void;
		},
	) => {
		return createMutation(() => ({
			mutationFn: async (variables: TInput) => {
				const result = await client.mutation(path, variables);
				return result as TOutput;
			},
			onSuccess: options?.().onSuccess,
			onError: options?.().onError,
		}));
	};

	return {
		createTRPCQuery,
		createTRPCMutation,
		invalidateQueries: (path: string) => {
			queryClient.invalidateQueries({ queryKey: [path] });
		},
		refetchQueries: (path: string) => {
			queryClient.refetchQueries({ queryKey: [path] });
		},
	};
};

interface TrpcProviderProps {
	queryClient?: QueryClient;
}

export const TrpcProvider: ParentComponent<TrpcProviderProps> = (props) => {
	const queryClient = props.queryClient ?? createQueryClient();
	const trpcClient = createTrpcClient();

	return (
		<QueryClientProvider client={queryClient}>
			<QueryClientContext.Provider value={queryClient}>
				<TRPCContext.Provider value={trpcClient}>
					{props.children}
				</TRPCContext.Provider>
			</QueryClientContext.Provider>
		</QueryClientProvider>
	);
};

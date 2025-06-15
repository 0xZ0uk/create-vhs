import "@/styles/globals.css";

import { createQueryClient } from "@/trpc/client";
import { ColorModeProvider, ColorModeScript } from "@kobalte/core";
import { QueryClientProvider } from "@tanstack/solid-query";
import type { JSX } from "solid-js";

export default function LayoutDefault(props: { children?: JSX.Element }) {
	return (
		<Providers>
			<main class="mx-auto flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-50% from-transparent to-red-950/50 p-4 text-center text-foreground">
				<Content>{props.children}</Content>
			</main>
		</Providers>
	);
}

function Content(props: { children: JSX.Element }) {
	return <div>{props.children}</div>;
}

const queryClient = createQueryClient();

function Providers(props: { children: JSX.Element }) {
	return (
		<QueryClientProvider client={queryClient}>
			<ColorModeScript />
			<ColorModeProvider>{props.children}</ColorModeProvider>
		</QueryClientProvider>
	);
}

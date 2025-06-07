import { ColorModeProvider, ColorModeScript } from "@kobalte/core";
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

import { TRPCSolidProvider } from "./trpc/solid";

import "@vhs/ui/styles/globals.css";

export default function App() {
	return (
		<TRPCSolidProvider>
			<Router
				root={(props) => (
					<MetaProvider>
						<Title>VHS</Title>
						<Suspense>
							<ColorModeScript />
							<ColorModeProvider>{props.children}</ColorModeProvider>
						</Suspense>
					</MetaProvider>
				)}
			>
				<FileRoutes />
			</Router>
		</TRPCSolidProvider>
	);
}

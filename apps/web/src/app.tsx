import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "./components/Nav";

import "@vhs/ui/styles/globals.css";
import { MetaProvider, Title } from "@solidjs/meta";

export default function App() {
	return (
		<Router
			root={(props) => (
				<>
					<Nav />
					<Suspense>{props.children}</Suspense>
				</>
			)}
		>
			<FileRoutes />
		</Router>
	);
}

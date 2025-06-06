import { Link, Meta, MetaProvider, Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { Button } from "@vhs/ui/components/button";

export default function Home() {
	return (
		<MetaProvider>
			<Title>VHS</Title>
			<main class="mx-auto p-4 text-center text-foreground">
				<h1 class="max-6-xs my-16 font-bold text-6xl text-primary uppercase">
					VHS
				</h1>
				<p>Vite + Hono + Solid</p>

				<Button>Hello</Button>
			</main>
		</MetaProvider>
	);
}

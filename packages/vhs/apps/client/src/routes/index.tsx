import Cassette from "@/components/Cassette";
import { MetaProvider, Title } from "@solidjs/meta";
import { Button } from "@vhs/ui/components/button";

export default function Home() {
	return (
		<MetaProvider>
			<Title>VHS</Title>
			<main class="mx-auto flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-50% from-transparent to-red-950/50 p-4 text-center text-foreground">
				<section class="flex min-h-[64rem] flex-col items-center justify-center">
					<img
						src="/assets/branding/logo.png"
						alt="VHS"
						class="rotate-[2deg]"
					/>
					<p class="mb-8 text-foreground/80">
						<a
							class="cursor-pointer text-primary hover:underline"
							href="https://vhs.dev"
							target="_blank"
							rel="noreferrer"
						>
							VHS
						</a>{" "}
						is a web development stack built for the modern web &mdash;
						<br />
						focused on simplicity and full type-safety.
					</p>
					<Cassette />
				</section>
				<section class="mx-auto grid w-full max-w-7xl grid-cols-3 gap-4">
					<div class="flex h-fit w-full flex-col items-start justify-start rounded-md border bg-card p-6">
						<h3 class="font-bold text-xl">Getting Started</h3>
						<p class="mb-10 text-card-foreground">
							Read our 'Getting Started' guide
						</p>
						<Button variant="default">Read More</Button>
					</div>
					<div class="flex h-fit w-full flex-col items-start justify-start rounded-md border bg-card p-6">
						<h3 class="font-bold text-xl">Docs</h3>
						<p class="mb-10 text-card-foreground">Read our 'Documentation'</p>
						<Button variant="default">Read More</Button>
					</div>
					<div class="flex h-fit w-full flex-col items-start justify-start rounded-md border bg-card p-6">
						<h3 class="font-bold text-xl">@vhs/ui</h3>
						<p class="mb-10 text-card-foreground">
							Try out{" "}
							<code class="rounded-md bg-muted px-1 py-0.5 text-primary/80">
								@vhs/ui
							</code>
						</p>
						<Button variant="default">Read More</Button>
					</div>
				</section>
			</main>
		</MetaProvider>
	);
}

import { Link } from "@/components/Link";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/solid-query";
import { Post } from "./Post";

export default function Page() {
	const helloQuery = useQuery(() => ({
		queryKey: ["hello"],
		queryFn: () => api.post.hello.query({ text: "from TRPC" }),
	}));

	return (
		<div class="container flex min-h-screen flex-col items-center justify-center gap-12 px-4 py-16">
			<h1 class="font-extrabold text-5xl tracking-tight sm:text-[5rem]">
				Create <span class="text-red-500">VHS</span> App
			</h1>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
				<Link
					class="flex max-w-xs flex-col items-start justify-start gap-4 rounded-xl bg-white/10 p-4 text-start hover:bg-white/20"
					href="https://create.t3.gg/en/usage/first-steps"
					target="_blank"
				>
					<h3 class="font-bold text-2xl">First Steps →</h3>
					<div class="text-lg">
						Just the basics - Everything you need to know to set up your
						database and authentication.
					</div>
				</Link>
				<Link
					class="flex max-w-xs flex-col items-start justify-start gap-4 rounded-xl bg-white/10 p-4 text-start hover:bg-white/20"
					href="https://create.t3.gg/en/introduction"
					target="_blank"
				>
					<h3 class="font-bold text-2xl">Documentation →</h3>
					<div class="text-lg">
						Learn more about Create VHS App, the libraries it uses, and how to
						deploy it.
					</div>
				</Link>
			</div>
			<div class="flex flex-col items-center gap-2">
				<p class="text-2xl text-white">
					{helloQuery.isLoading ? "Loading..." : helloQuery.data?.greeting}
				</p>
			</div>
			<Post />
		</div>
	);
}

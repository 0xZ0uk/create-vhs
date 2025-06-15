import { api } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/solid-query";
import { createSignal } from "solid-js";

export function Post() {
	const [title, setTitle] = createSignal("");

	const latestPosts = useQuery(() => ({
		queryKey: ["latestPosts"],
		queryFn: () => api.post.getLatest.query(),
	}));

	const createPost = useMutation(() => ({
		mutationFn: (data: { title: string }) => {
			return api.post.create.mutate({ name: data.title });
		},
		onSuccess: (data) => {
			latestPosts.refetch();
			setTitle("");
		},
	}));

	return (
		<div class="w-full">
			{latestPosts.data ? (
				<p class="truncate">Your most recent post: {latestPosts.data.name}</p>
			) : (
				<p>You have no posts yet.</p>
			)}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					createPost.mutate({ title: title() });
				}}
				class="flex flex-col gap-2"
			>
				<input
					type="text"
					placeholder="Title"
					value={title()}
					onChange={(e) => setTitle(e.target.value)}
					class="w-full rounded-full bg-white/10 px-4 py-2 text-white"
				/>
				<button
					type="submit"
					class="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
					disabled={createPost.isPending}
				>
					{createPost.isPending ? "Submitting..." : "Submit"}
				</button>
			</form>
		</div>
	);
}

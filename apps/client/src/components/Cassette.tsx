import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/solid-query";
import { Button } from "@vhs/ui/components/button";
import { Input } from "@vhs/ui/components/input";

import { createSignal } from "solid-js";

export default function Cassette() {
	const [title, setTitle] = createSignal<string>("");

	const [result, setResult] = createSignal<{ message: string } | undefined>(
		undefined,
	);

	const { mutate } = useMutation(() => ({
		mutationFn: ({ title }: { title: string }) => {
			return trpc.vhs.create.mutate({ title });
		},
		onSuccess: (data) => {
			setResult(data);
		},
	}));

	const handleChangeCasseteTitle = (value: string) => {
		setTitle(value);
	};

	return (
		<div class="space-y-2">
			<Input
				type="text"
				value={title()}
				onChange={(e) => handleChangeCasseteTitle(e.currentTarget.value)}
			/>
			<Button
				size="lg"
				onClick={() => {
					mutate({ title: title() });
				}}
			>
				Try the "Hello VHS" tRPC route
			</Button>
			{result() && (
				<pre class="rounded-md bg-muted py-2 text-muted-foreground">
					{result()?.message}
				</pre>
			)}
		</div>
	);
}

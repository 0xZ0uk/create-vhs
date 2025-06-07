import { api } from "@/libs/api";
import { createAsync, query } from "@solidjs/router";
import { Button } from "@vhs/ui/components/button";

const getHello = query(async () => await api.vhs.hello.query(), "hello");

export default function Cassette() {
	const hello = createAsync(() => getHello());

	return (
		<div class="space-y-2">
			<Button size="lg">Try the "Hello VHS" tRPC route</Button>
			<pre class="rounded-md bg-muted py-2 text-muted-foreground">
				{hello()?.message}
			</pre>
		</div>
	);
}

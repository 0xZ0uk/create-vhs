import { api } from "@/trpc/solid";
import { createAsync, query } from "@solidjs/router";
import { Button } from "@vhs/ui/components/button";

const getHello = query(async () => await api.vhs.hello.query(), "hello");

export default function Cassette() {
	const hello = createAsync(() => getHello());
	return (
		<div>
			<Button size="lg">Try the "Hello VHS" tRPC route</Button>
			<pre>{hello()?.message}</pre>
		</div>
	);
}

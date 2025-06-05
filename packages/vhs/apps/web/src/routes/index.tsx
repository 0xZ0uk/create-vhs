import { Button } from "@/components/button";
import { A } from "@solidjs/router";
import ky, { type KyResponse } from "ky";
import { createResource, createSignal } from "solid-js";

const SERVER_URL = "http://localhost:3001";

async function sendRequest() {
	try {
		return await ky(`${SERVER_URL}/vhs`).json<{ message: string }>();
	} catch (error) {
		console.error("API Error:", error);
		throw error;
	}
}

export default function Home() {
	const [shouldFetch, setShouldFetch] = createSignal(false);
	const [message] = createResource(shouldFetch, sendRequest);

	const handleApiCall = () => {
		setShouldFetch(true);
	};

	return (
		<main class="mx-auto p-4 text-center text-gray-700">
			<h1 class="max-6-xs my-16 font-thin text-6xl text-sky-700 uppercase">
				VHS
			</h1>
			<p>Vite + Hono + Solid</p>
			<div class="button-container">
				<Button
					type="button"
					class="rounded border bg-white px-4 py-2 text-black"
					onClick={handleApiCall}
					disabled={message.loading}
				>
					{message.loading ? "Loading..." : "Call API"}
				</Button>
			</div>
			{message()?.message && (
				<pre class="response">
					<code>
						Message: {message()?.message} <br />
					</code>
				</pre>
			)}
		</main>
	);
}

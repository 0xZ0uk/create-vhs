import path from "node:path";
import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				"@web": path.resolve(import.meta.dirname, "./src"),
				"@server": path.resolve(import.meta.dirname, "../server/src"),
			},
		},
	},
});

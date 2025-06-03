import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				"@web": path.resolve(__dirname, "./src"),
				"@api": path.resolve(__dirname, "../api/src"),
			},
		},
	},
});

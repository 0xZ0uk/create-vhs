import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import starlightLlmsTxt from "starlight-llms-txt";
import starlightVideos from "starlight-videos";

import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: "VHS Docs",
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/0xZ0uk/create-vhs",
				},
			],
			sidebar: [
				{
					label: "Create VHS App",
					items: [
						{ label: "Why VHS?", slug: "why" },
						{ label: "Installation", slug: "installation" },
						{ label: "Folder Structure", slug: "folder-structure" },
					],
				},
				{
					label: "Guides",
					items: [
						{ label: "Getting Started", slug: "guides/getting-started" },
						{ label: "SolidJS", slug: "guides/solidjs" },
						{ label: "Vike Router", slug: "guides/vike-router" },
						{ label: "Hono + tRPC", slug: "guides/hono-trpc" },
						{ label: "UnoCSS", slug: "guides/unocss" },
					],
				},
				{
					label: "Deployment",
					autogenerate: { directory: "deployment" },
				},
			],
			logo: {
				src: "./src/assets/logo.png",
				alt: "VHS",
			},
			favicon: "./src/assets/favicon.svg",
			customCss: ["./src/styles/global.css"],
			plugins: [starlightLlmsTxt(), starlightVideos()],
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});

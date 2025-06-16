import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

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
						{ label: "Vike", slug: "guides/vike" },
					],
				},
				{
					label: "Deployment",
					autogenerate: { directory: "deployment" },
				},
			],
			customCss: ["./src/styles/global.css"],
			logo: {
				src: "./src/assets/logo.png",
				alt: "VHS",
			},
			favicon: "./src/assets/favicon.svg",
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});

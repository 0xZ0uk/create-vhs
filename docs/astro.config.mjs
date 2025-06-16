import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
// @ts-check
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
						// { label: "Installation", slug: "installation" },
						// { label: "Folder Structure", slug: "folder-structure" },
						// { label: "FAQ", slug: "faq" },
						// { label: "Examples", slug: "examples" },
					],
				},
				{
					label: "Usage",
					autogenerate: { directory: "usage" },
				},
				{
					label: "Deployment",
					autogenerate: { directory: "deployment" },
				},
			],
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});

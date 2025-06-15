import Layout from "@/layouts/LayoutDefault";
import vikeSolid from "vike-solid/config";
import type { Config } from "vike/types";

// Default config (can be overridden by pages)
// https://vike.dev/config
export default {
	// https://vike.dev/Layout
	Layout,
	// https://vike.dev/head-tags
	title: "My VHS App",
	description: "Demo showcasing VHS",
	extends: [vikeSolid],
} satisfies Config;

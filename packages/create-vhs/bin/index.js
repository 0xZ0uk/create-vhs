#!/usr/bin/env node

import { cli } from "../dist/cli.js";

cli().catch((error) => {
	console.error(error);
	process.exit(1);
});

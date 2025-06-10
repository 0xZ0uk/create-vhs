import path from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import { program } from "commander";
import { createProject } from "./installer.js";
import { promptForOptions } from "./prompts.js";
import type { CLIOptions, ProjectOptions } from "./types.js";
import { validateProjectName } from "./utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function resolveOptions(projectName: string, options: any) {
	let resolvedProjectName = projectName;
	let resolvedOptions = options;

	if (!resolvedProjectName) {
		const answers = await promptForOptions();
		resolvedProjectName = answers.projectName;
		resolvedOptions = { ...resolvedOptions, ...answers };
	}

	// Use `resolvedProjectName` and `resolvedOptions` downstream
}

export async function cli(): Promise<void> {
	program
		.name("create-vhs")
		.description("Create a new VHS monorepo project")
		.version("1.0.0")
		.argument("[project-name]", "Name of the project")
		.option(
			"-t, --template <template>",
			"Template to use (basic, fullstack, library, microservices)",
		)
		.option("--typescript", "Use TypeScript (default: true)")
		.option("--javascript", "Use JavaScript instead of TypeScript")
		.option("--skip-install", "Skip package installation")
		.option("--use-npm", "Use npm instead of bun")
		.option("--use-yarn", "Use yarn instead of bun")
		.option("--use-pnpm", "Use pnpm instead of bun")
		.action(async (projectName: string | undefined, options: CLIOptions) => {
			try {
				console.log(chalk.blue.bold("\n🚀 Create My Bun App\n"));
				console.log(chalk.gray("A TypeScript-first Bun monorepo generator\n"));

				// Validate or prompt for project name
				if (!projectName) {
					const answers = await promptForOptions();

					projectName = answers.projectName;
					options = { ...options, ...answers };
				}

				if (!projectName || !validateProjectName(projectName)) {
					console.error(chalk.red("❌ Invalid project name"));
					console.error(
						chalk.yellow("Project name must be a valid npm package name"),
					);
					process.exit(1);
				}

				// Handle TypeScript/JavaScript flag
				if (options.typescript === undefined && !(options as any).javascript) {
					options.typescript = true; // Default to TypeScript
				} else if ((options as any).javascript) {
					options.typescript = false;
				}

				// Get final options through prompts if not provided
				const finalOptions: ProjectOptions = await promptForOptions(
					projectName,
					options,
				);

				// Create the project
				await createProject(projectName, finalOptions);

				console.log(
					chalk.green.bold(`\n✅ Successfully created ${projectName}!`),
				);
				console.log(chalk.cyan("\nNext steps:"));
				console.log(chalk.white(`  cd ${projectName}`));

				if (!finalOptions.skipInstall) {
					console.log(
						chalk.white(
							`  ${getPackageManagerRunCommand(finalOptions.packageManager)} dev`,
						),
					);
				} else {
					console.log(chalk.white(`  ${finalOptions.packageManager} install`));
					console.log(
						chalk.white(
							`  ${getPackageManagerRunCommand(finalOptions.packageManager)} dev`,
						),
					);
				}

				console.log(
					chalk.gray("\n📖 Check out the README.md for more information"),
				);
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Unknown error occurred";
				console.error(chalk.red("❌ Error creating project:"), errorMessage);
				if (process.env.DEBUG) {
					console.error(error);
				}
				process.exit(1);
			}
		});

	await program.parseAsync();
}

function getPackageManagerRunCommand(packageManager: string): string {
	const commands: Record<string, string> = {
		bun: "bun",
		npm: "npm run",
		yarn: "yarn",
		pnpm: "pnpm",
	};

	return commands[packageManager] || "bun";
}

if (import.meta.main) {
	console.log("Running CLI directly from cli.ts");
	cli().catch(console.error);
}

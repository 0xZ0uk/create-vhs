import chalk from "chalk";
import inquirer, { type DistinctQuestion } from "inquirer";
import type {
	CLIOptions,
	PackageManagerType,
	ProjectOptions,
	TemplateType,
} from "./types.js";

interface PromptAnswers {
	projectName?: string;
	template?: TemplateType;
	typescript?: boolean;
	packageManager?: PackageManagerType;
}

export async function promptForOptions(
	projectName?: string,
	existingOptions: CLIOptions = {},
): Promise<ProjectOptions> {
	const questions: DistinctQuestion<PromptAnswers>[] = [];

	// Project name if not provided
	if (!projectName) {
		questions.push({
			type: "input",
			name: "projectName",
			message: "📦 What is your project named?",
			default: "my-vhs-app",
			filter: (input: string) => input.trim().toLowerCase(),
		});
	}

	// Template selection if not provided
	if (!existingOptions.template) {
		questions.push({
			type: "list",
			name: "template",
			message: "🎨 Which template would you like to use?",
			choices: [
				{
					name: `${chalk.green("Basic")} - Simple monorepo with shared packages`,
					value: "basic" as TemplateType,
					short: "Basic",
				},
				{
					name: `${chalk.magenta("Farcaster mini-app")} - All you need to create your Farcaster mini-app.`,
					value: "mini-app" as TemplateType,
					short: "Farcaster Mini App",
				},
			],
			default: "basic" as TemplateType,
		});
	}
	// Package manager if not specified
	if (
		!existingOptions.useNpm &&
		!existingOptions.useYarn &&
		!existingOptions.usePnpm
	) {
		questions.push({
			type: "list",
			name: "packageManager",
			message: "📦 Which package manager would you like to use?",
			choices: [
				{
					name: `${chalk.yellow("Bun")} (recommended for speed)`,
					value: "bun" as PackageManagerType,
					short: "Bun",
				},
				{
					name: `${chalk.red("npm")} (Node.js default)`,
					value: "npm" as PackageManagerType,
					short: "npm",
				},
				{
					name: `${chalk.blue("yarn")} (Classic choice)`,
					value: "yarn" as PackageManagerType,
					short: "yarn",
				},
				{
					name: `${chalk.green("pnpm")} (Efficient storage)`,
					value: "pnpm" as PackageManagerType,
					short: "pnpm",
				},
			],
			default: "bun" as PackageManagerType,
		});
	}

	// Additional features
	// questions.push({
	// 	type: "checkbox",
	// 	name: "features",
	// 	message: "🔧 Select additional features:",
	// 	choices: [
	// 		{
	// 			name: `${chalk.cyan("Biome")} - Fast linter and formatter (recommended)`,
	// 			value: "biome" as Feature,
	// 			checked: true,
	// 		},
	// 	],
	// });

	const answers = await inquirer.prompt(questions);

	return {
		projectName: projectName || answers.projectName,
		template: (existingOptions.template || answers.template) as TemplateType,
		packageManager: answers.packageManager || "bun",
		skipInstall: existingOptions.skipInstall || false,
	};
}

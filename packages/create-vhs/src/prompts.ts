import chalk from "chalk";
import inquirer, { type DistinctQuestion } from "inquirer";
import type {
	CLIOptions,
	Feature,
	PackageManagerType,
	ProjectOptions,
	TemplateType,
} from "./types.js";
import { validateProjectName } from "./utils.js";

interface PromptAnswers {
	projectName?: string;
	template?: TemplateType;
	typescript?: boolean;
	packageManager?: PackageManagerType;
	features?: Feature[];
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
					name: `${chalk.cyan("Basic")} - Simple monorepo with shared packages`,
					value: "basic" as TemplateType,
					short: "Basic",
				},
				{
					name: `${chalk.green("Full-stack")} - All you need to create your app.`,
					value: "pro" as TemplateType,
					short: "Pro",
				},
			],
			default: "basic" as TemplateType,
		});
	}

	// TypeScript if not specified
	if (existingOptions.typescript === undefined) {
		questions.push({
			type: "confirm",
			name: "typescript",
			message: "📝 Would you like to use TypeScript?",
			default: true,
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
	questions.push({
		type: "checkbox",
		name: "features",
		message: "🔧 Select additional features:",
		choices: [
			{
				name: `${chalk.cyan("Biome")} - Fast linter and formatter (recommended)`,
				value: "biome" as Feature,
				checked: true,
			},
			{
				name: `${chalk.yellow("ESLint + Prettier")} - Traditional linting setup`,
				value: "linting" as Feature,
				checked: false,
			},
			{
				name: `${chalk.green("Husky + lint-staged")} - Git hooks`,
				value: "husky" as Feature,
				checked: true,
			},
			{
				name: `${chalk.blue("Turborepo")} - High-performance build system`,
				value: "turborepo" as Feature,
				checked: true,
			},
			{
				name: `${chalk.magenta("Changesets")} - Version management`,
				value: "changesets" as Feature,
				checked: false,
			},
			{
				name: `${chalk.gray("GitHub Actions")} - CI/CD workflows`,
				value: "github-actions" as Feature,
				checked: false,
			},
			{
				name: `${chalk.cyan("Docker")} - Containerization support`,
				value: "docker" as Feature,
				checked: false,
			},
			{
				name: `${chalk.green("Testing")} - Bun test + Vitest setup`,
				value: "testing" as Feature,
				checked: true,
			},
		],
	});

	const answers = await inquirer.prompt(questions);

	return {
		projectName: projectName || answers.projectName,
		template: (existingOptions.template || answers.template) as TemplateType,
		typescript: existingOptions.typescript ?? answers.typescript ?? true,
		packageManager:
			getPackageManager(existingOptions) || answers.packageManager,
		features: answers.features || [],
		skipInstall: existingOptions.skipInstall || false,
	};
}

function getPackageManager(options: CLIOptions): PackageManagerType | null {
	if (options.useNpm) return "npm";
	if (options.useYarn) return "yarn";
	if (options.usePnpm) return "pnpm";
	return null;
}

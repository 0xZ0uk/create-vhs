import path from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import degit from "degit";
import { execa } from "execa";
import fs from "fs-extra";
import ora from "ora";
import type { ProjectOptions, SpinnerStep, TemplateVariable } from "./types.js";
import {
	createGitIgnore,
	replaceTemplateVariables,
	updatePackageJson,
	updateTsConfig,
} from "./utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createProject(
	projectName: string,
	options: ProjectOptions,
): Promise<void> {
	const projectPath = path.resolve(process.cwd(), projectName);

	// Check if directory exists
	if (await fs.pathExists(projectPath)) {
		throw new Error(`Directory ${projectName} already exists`);
	}

	// const templateSource = getTemplateSource(options.template);
	// const credentials: { username?: string; token?: string } = {};
	//
	// if (
	// 	templateSource.startsWith("https://github.com/") &&
	// 	templateSource.includes("0xZ0uk/vhs") // adjust as needed
	// ) {
	// 	console.log(
	// 		chalk.yellow("🔒 This template is private. Authentication required."),
	// 	);
	// 	const { username, token } = await inquirer.prompt([
	// 		{
	// 			type: "input",
	// 			name: "username",
	// 			message: "GitHub Username:",
	// 		},
	// 		{
	// 			type: "password",
	// 			name: "token",
	// 			message: "GitHub Personal Access Token (recommended) or password:",
	// 			mask: "*",
	// 		},
	// 	]);
	// 	// Inject credentials into the URL
	// 	templateSource = templateSource.replace(
	// 		"https://github.com/",
	// 		`https://${encodeURIComponent(username)}:${encodeURIComponent(token)}@github.com/`,
	// 	);
	// }

	const steps: SpinnerStep[] = [
		{
			text: "Creating project directory...",
			action: async () => {
				await fs.ensureDir(projectPath);
			},
			successText: "Project directory created",
		},
		{
			text: "Setting up template...",
			action: async () => {
				await setupTemplate(projectPath, options);
			},
			successText: "Template setup complete",
		},
		{
			text: "Processing template files...",
			action: async () => {
				await processTemplateFiles(projectPath, projectName, options);
			},
			successText: "Template files processed",
		},
	];

	if (!options.skipInstall) {
		steps.push({
			text: `Installing dependencies with ${options.packageManager}...`,
			action: async () => {
				await installDependencies(projectPath, options.packageManager);
			},
			successText: "Dependencies installed",
		});
	}

	steps.push({
		text: "Initializing git repository...",
		action: async () => {
			await initializeGit(projectPath);
		},
		successText: "Git repository initialized",
	});

	// Execute steps with spinners
	for (const step of steps) {
		const spinner = ora(step.text).start();

		try {
			await step.action();
			spinner.succeed(step.successText || step.text);
		} catch (error) {
			spinner.fail(step.failText || `Failed: ${step.text}`);
			// Cleanup on failure
			await fs.remove(projectPath);
			throw error;
		}
	}
}

async function setupTemplate(
	projectPath: string,
	options: ProjectOptions,
): Promise<void> {
	const templateSource = getTemplateSource(options.template);

	if (templateSource.startsWith("http") || templateSource.includes("/")) {
		// Remote template (GitHub repo)
		const emitter = degit(templateSource, {
			cache: false,
			force: true,
			verbose: true,
		});

		await emitter.clone(projectPath);
	} else {
		// Local template
		const templatePath = path.join(
			__dirname,
			"..",
			"templates",
			templateSource,
		);

		if (await fs.pathExists(templatePath)) {
			await fs.copy(templatePath, projectPath);
		} else {
			throw new Error(`Template not found: ${templateSource}`);
		}
	}
}

async function processTemplateFiles(
	projectPath: string,
	projectName: string,
	options: ProjectOptions,
): Promise<void> {
	const templateVars: TemplateVariable = {
		PROJECT_NAME: projectName,
		PACKAGE_MANAGER: options.packageManager,
		TEMPLATE_TYPE: options.template,
	};

	// Update package.json
	await updatePackageJson(projectPath, projectName, options);
	await updateTsConfig(projectPath, options);
	await createGitIgnore(projectPath, options);

	// Process template variables in files
	const filesToProcess = [
		"README.md",
		"package.json",
		"apps/*/package.json",
		"packages/*/package.json",
	];

	for (const pattern of filesToProcess) {
		await replaceTemplateVariables(projectPath, pattern, templateVars);
	}
}

async function installDependencies(
	projectPath: string,
	packageManager: string,
): Promise<void> {
	const commands: Record<string, [string, string[]]> = {
		bun: ["bun", ["install"]],
		npm: ["npm", ["install"]],
		yarn: ["yarn", []],
		pnpm: ["pnpm", ["install"]],
	};

	const [cmd, args] = commands[packageManager] || ["bun", ["install"]]; // Default to npm if not found

	await execa(cmd, args, {
		cwd: projectPath,
		stdio: "pipe",
	});
}

async function initializeGit(projectPath: string): Promise<void> {
	try {
		await execa("git", ["init"], { cwd: projectPath });
		await execa("git", ["add", "."], { cwd: projectPath });
		await execa("git", ["commit", "-m", "feat: initial commit"], {
			cwd: projectPath,
		});
	} catch (error) {
		// Git initialization is optional
		console.warn(
			chalk.yellow("⚠️  Warning: Could not initialize git repository"),
		);
	}
}

function getTemplateSource(template: string): string {
	// Map template names to GitHub repos or local paths
	const templateMap: Record<string, string> = {
		basic: "https://github.com/0xZ0uk/vhs.git",
		pro: "https://github.com/0xZ0uk/vhs.git",
	};

	return templateMap[template] || template;
}

import path from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import degit from "degit";
import { execa } from "execa";
import fs from "fs-extra";
import ora, { type Ora } from "ora";
import type {
	Feature,
	ProjectOptions,
	SpinnerStep,
	TemplateVariable,
} from "./types.js";
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
			verbose: false,
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
		USE_TYPESCRIPT: options.typescript,
		TEMPLATE_TYPE: options.template,
		HAS_TURBOREPO: options.features.includes("turborepo"),
		HAS_CHANGESETS: options.features.includes("changesets"),
		HAS_DOCKER: options.features.includes("docker"),
		HAS_GITHUB_ACTIONS: options.features.includes("github-actions"),
	};

	// Update package.json
	await updatePackageJson(projectPath, projectName, options);

	// Update tsconfig.json if TypeScript
	if (options.typescript) {
		await updateTsConfig(projectPath, options);
	}

	// Create .gitignore
	await createGitIgnore(projectPath, options);

	// Process template variables in files
	const filesToProcess = [
		"README.md",
		"package.json",
		"apps/*/package.json",
		"packages/*/package.json",
		"turbo.json",
		".github/workflows/*.yml",
		"docker-compose.yml",
		"Dockerfile",
	];

	for (const pattern of filesToProcess) {
		await replaceTemplateVariables(projectPath, pattern, templateVars);
	}

	// Handle TypeScript/JavaScript variants
	if (!options.typescript) {
		await convertToJavaScript(projectPath);
	}

	// Add selected features
	if (options.features.length > 0) {
		await addFeatures(projectPath, options.features, options);
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
		basic: "yourusername/bun-monorepo-basic",
		fullstack: "yourusername/bun-monorepo-fullstack",
		library: "yourusername/bun-monorepo-library",
		microservices: "yourusername/bun-monorepo-microservices",
	};

	return templateMap[template] || template;
}

async function convertToJavaScript(projectPath: string): Promise<void> {
	const { glob } = await import("glob");

	// Convert .ts files to .js and remove TypeScript-specific content
	const tsFiles = await glob("**/*.ts", {
		cwd: projectPath,
		ignore: ["node_modules/**", "dist/**"],
	});

	for (const file of tsFiles) {
		const fullPath = path.join(projectPath, file);
		const jsPath = fullPath.replace(/\.ts$/, ".js");

		let content = await fs.readFile(fullPath, "utf8");

		// Basic TypeScript to JavaScript conversion
		content = content
			.replace(/:\s*\w+(\[\])?(\s*[=,;)])/g, "$2") // Remove type annotations
			.replace(/interface\s+\w+\s*{[^}]*}/g, "") // Remove interfaces
			.replace(/type\s+\w+\s*=[^;]+;/g, "") // Remove type aliases
			.replace(/import\s+type\s+.*?from.*?;?\n/g, "") // Remove type imports
			.replace(/<[^>]+>/g, "") // Remove generic types
			.replace(/as\s+\w+/g, ""); // Remove type assertions

		await fs.writeFile(jsPath, content);
		await fs.remove(fullPath);
	}

	// Remove TypeScript config files
	const tsConfigFiles = ["tsconfig.json", "tsconfig.*.json"];
	for (const pattern of tsConfigFiles) {
		const files = await glob(pattern, { cwd: projectPath });
		for (const file of files) {
			await fs.remove(path.join(projectPath, file));
		}
	}
}

async function addFeatures(
	projectPath: string,
	features: Feature[],
	options: ProjectOptions,
): Promise<void> {
	const featureHandlers: Record<Feature, () => Promise<void>> = {
		linting: () => addLintingConfig(projectPath, options),
		biome: () => addBiomeConfig(projectPath, options),
		husky: () => addHuskyConfig(projectPath, options),
		"github-actions": () => addGitHubActions(projectPath, options),
		docker: () => addDockerSupport(projectPath, options),
		testing: () => addTestingSetup(projectPath, options),
		turborepo: () => addTurborepoConfig(projectPath, options),
		changesets: () => addChangesetsConfig(projectPath, options),
	};

	for (const feature of features) {
		const handler = featureHandlers[feature];
		if (handler) {
			await handler();
		}
	}
}

// Feature addition functions
async function addLintingConfig(
	projectPath: string,
	options: ProjectOptions,
): Promise<void> {
	// Add ESLint and Prettier configuration files
	const eslintConfig = {
		extends: options.typescript
			? ["@typescript-eslint/recommended"]
			: ["eslint:recommended"],
		parser: options.typescript ? "@typescript-eslint/parser" : undefined,
		plugins: options.typescript ? ["@typescript-eslint"] : undefined,
		rules: {},
	};

	await fs.writeJson(path.join(projectPath, ".eslintrc.json"), eslintConfig, {
		spaces: 2,
	});

	const prettierConfig = {
		semi: true,
		trailingComma: "es5" as const,
		singleQuote: true,
		printWidth: 80,
		tabWidth: 2,
	};

	await fs.writeJson(path.join(projectPath, ".prettierrc"), prettierConfig, {
		spaces: 2,
	});
}

async function addBiomeConfig(
	projectPath: string,
	options: ProjectOptions,
): Promise<void> {
	const biomeConfig = {
		$schema: "https://biomejs.dev/schemas/1.4.1/schema.json",
		organizeImports: {
			enabled: true,
		},
		linter: {
			enabled: true,
			rules: {
				recommended: true,
			},
		},
		formatter: {
			enabled: true,
			indentStyle: "space" as const,
			indentWidth: 2,
		},
		javascript: {
			formatter: {
				semicolons: "always" as const,
				quoteStyle: "single" as const,
			},
		},
	};

	await fs.writeJson(path.join(projectPath, "biome.json"), biomeConfig, {
		spaces: 2,
	});
}

async function addHuskyConfig(
	projectPath: string,
	options: ProjectOptions,
): Promise<void> {
	const huskyDir = path.join(projectPath, ".husky");
	await fs.ensureDir(huskyDir);

	const preCommitHook = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

${options.packageManager} run lint-staged
`;

	await fs.writeFile(path.join(huskyDir, "pre-commit"), preCommitHook);
	await fs.chmod(path.join(huskyDir, "pre-commit"), "755");
}

async function addGitHubActions(
	projectPath: string,
	options: ProjectOptions,
): Promise<void> {
	const workflowsDir = path.join(projectPath, ".github", "workflows");
	await fs.ensureDir(workflowsDir);

	const ciWorkflow = `
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
          
      - name: Install dependencies
        run: bun install
        
      - name: Run tests
        run: bun test
        
      - name: Build
        run: bun run build
`;

	await fs.writeFile(path.join(workflowsDir, "ci.yml"), ciWorkflow.trim());
}

async function addDockerSupport(
	projectPath: string,
	options: ProjectOptions,
): Promise<void> {
	const dockerfile = `
FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

EXPOSE 3000

CMD ["bun", "start"]
`;

	await fs.writeFile(path.join(projectPath, "Dockerfile"), dockerfile.trim());
}

async function addTestingSetup(
	projectPath: string,
	options: ProjectOptions,
): Promise<void> {
	// Bun has built-in testing, so we just need to add test scripts and examples
	const testDir = path.join(projectPath, "tests");
	await fs.ensureDir(testDir);

	const sampleTest = options.typescript
		? `
import { expect, test, describe } from "bun:test";

describe("Sample Test Suite", () => {
  test("should pass", () => {
    expect(1 + 1).toBe(2);
  });
});
`
		: `
import { expect, test, describe } from "bun:test";

describe("Sample Test Suite", () => {
  test("should pass", () => {
    expect(1 + 1).toBe(2);
  });
});
`;

	const testFile = options.typescript ? "sample.test.ts" : "sample.test.js";
	await fs.writeFile(path.join(testDir, testFile), sampleTest.trim());
}

async function addTurborepoConfig(
	projectPath: string,
	options: ProjectOptions,
): Promise<void> {
	const turboConfig = {
		$schema: "https://turbo.build/schema.json",
		pipeline: {
			build: {
				dependsOn: ["^build"],
				outputs: ["dist/**", ".next/**"],
			},
			test: {
				dependsOn: ["build"],
			},
			lint: {},
			dev: {
				cache: false,
			},
		},
	};

	await fs.writeJson(path.join(projectPath, "turbo.json"), turboConfig, {
		spaces: 2,
	});
}

async function addChangesetsConfig(
	projectPath: string,
	options: ProjectOptions,
): Promise<void> {
	const changesetsDir = path.join(projectPath, ".changeset");
	await fs.ensureDir(changesetsDir);

	const config = {
		$schema: "https://unpkg.com/@changesets/config@2.3.1/schema.json",
		changelog: "@changesets/cli/changelog",
		commit: false,
		fixed: [],
		linked: [],
		access: "restricted" as const,
		baseBranch: "main",
		updateInternalDependencies: "patch" as const,
		ignore: [],
	};

	await fs.writeJson(path.join(changesetsDir, "config.json"), config, {
		spaces: 2,
	});
}

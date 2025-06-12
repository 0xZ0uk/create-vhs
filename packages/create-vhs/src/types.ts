export interface ProjectOptions {
	projectName: string;
	template: TemplateType;
	packageManager: PackageManagerType;
	// features: Feature[];
	skipInstall: boolean;
	useNpm?: boolean;
	useYarn?: boolean;
	usePnpm?: boolean;
}

export type TemplateType = "basic" | "mini-app";

export type PackageManagerType = "bun" | "npm" | "yarn" | "pnpm";

// export type Feature = "biome";

export interface TemplateVariable {
	[key: string]: string | boolean | number;
}

export interface TemplateConfig {
	name: string;
	description: string;
	source: string;
	// features: Feature[];
}

export interface CLIOptions {
	template?: TemplateType;
	skipInstall?: boolean;
	useNpm?: boolean;
	useYarn?: boolean;
	usePnpm?: boolean;
}

export interface PackageJson {
	name: string;
	version: string;
	description?: string;
	scripts?: Record<string, string>;
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	workspaces?: string[] | { packages: string[] };
	repository?: {
		type: string;
		url: string;
	};
	bugs?: {
		url: string;
	};
	homepage?: string;
	[key: string]: unknown;
}

export interface SpinnerStep {
	text: string;
	action: () => Promise<void>;
	successText?: string;
	failText?: string;
}

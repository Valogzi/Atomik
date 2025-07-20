import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface PackageManager {
	name: string;
	installCommand: string;
	runCommand: string;
	lockFile: string;
	configFile?: string;
}

export const PACKAGE_MANAGERS: Record<string, PackageManager> = {
	npm: {
		name: 'npm',
		installCommand: 'npm install',
		runCommand: 'npm run',
		lockFile: 'package-lock.json',
	},
	pnpm: {
		name: 'pnpm',
		installCommand: 'pnpm install',
		runCommand: 'pnpm',
		lockFile: 'pnpm-lock.yaml',
		configFile: '.pnpmrc',
	},
	yarn: {
		name: 'yarn',
		installCommand: 'yarn install',
		runCommand: 'yarn',
		lockFile: 'yarn.lock',
		configFile: '.yarnrc.yml',
	},
	bun: {
		name: 'bun',
		installCommand: 'bun install',
		runCommand: 'bun run',
		lockFile: 'bun.lockb',
	},
};

/**
 * Détecte le gestionnaire de packages utilisé
 */
export function detectPackageManager(projectPath?: string): PackageManager {
	const workingDir = projectPath || process.cwd();

	// 1. Vérifier les fichiers de lock
	for (const [name, pm] of Object.entries(PACKAGE_MANAGERS)) {
		const lockPath = path.join(workingDir, pm.lockFile);
		if (fs.existsSync(lockPath)) {
			console.log(`📦 Detected ${pm.name} (found ${pm.lockFile})`);
			return pm;
		}
	}

	// 2. Vérifier les fichiers de config
	for (const [name, pm] of Object.entries(PACKAGE_MANAGERS)) {
		if (pm.configFile) {
			const configPath = path.join(workingDir, pm.configFile);
			if (fs.existsSync(configPath)) {
				console.log(`📦 Detected ${pm.name} (found ${pm.configFile})`);
				return pm;
			}
		}
	}

	// 3. Vérifier package.json packageManager field
	const packageJsonPath = path.join(workingDir, 'package.json');
	if (fs.existsSync(packageJsonPath)) {
		try {
			const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
			if (packageJson.packageManager) {
				const pmName = packageJson.packageManager.split('@')[0];
				if (PACKAGE_MANAGERS[pmName]) {
					console.log(
						`📦 Detected ${pmName} (from package.json packageManager)`,
					);
					return PACKAGE_MANAGERS[pmName];
				}
			}
		} catch (error) {
			// Ignore parsing errors
		}
	}

	// 4. Vérifier la variable d'environnement npm_config_user_agent
	const userAgent = process.env.npm_config_user_agent;
	if (userAgent) {
		if (userAgent.includes('pnpm')) return PACKAGE_MANAGERS.pnpm;
		if (userAgent.includes('yarn')) return PACKAGE_MANAGERS.yarn;
		if (userAgent.includes('bun')) return PACKAGE_MANAGERS.bun;
	}

	// 5. Vérifier les commandes disponibles
	const availableManagers = [];
	for (const [name, pm] of Object.entries(PACKAGE_MANAGERS)) {
		try {
			execSync(`${pm.name} --version`, { stdio: 'ignore' });
			availableManagers.push({ name, pm });
		} catch {
			// Command not available
		}
	}

	// Préférer pnpm > yarn > bun > npm si disponibles
	const preferenceOrder = ['pnpm', 'yarn', 'bun', 'npm'];
	for (const preferred of preferenceOrder) {
		const found = availableManagers.find(am => am.name === preferred);
		if (found) {
			console.log(`📦 Using ${found.pm.name} (detected as available)`);
			return found.pm;
		}
	}

	// Fallback vers npm (toujours disponible avec Node.js)
	console.log('📦 Using npm (fallback)');
	return PACKAGE_MANAGERS.npm;
}

/**
 * Exécute une commande d'installation
 */
export function installDependencies(
	packageManager: PackageManager,
	projectPath: string,
) {
	console.log(`📦 Installing dependencies with ${packageManager.name}...`);

	const originalCwd = process.cwd();
	process.chdir(projectPath);

	try {
		execSync(packageManager.installCommand, {
			stdio: 'inherit',
			env: { ...process.env },
		});
	} finally {
		process.chdir(originalCwd);
	}
}

/**
 * Génère les scripts npm adaptés au gestionnaire de packages
 */
export function generateScripts(
	packageManager: PackageManager,
	isTypeScript: boolean,
) {
	const baseScripts = isTypeScript
		? {
				dev: 'ts-node-dev --respawn --transpile-only src/index.ts',
				build: 'tsc',
				start: 'node dist/index.js',
		  }
		: {
				dev: 'node --watch src/index.js',
				start: 'node src/index.js',
		  };

	// Adapter les scripts selon le gestionnaire
	if (packageManager.name === 'bun') {
		return isTypeScript
			? {
					dev: 'bun run --watch src/index.ts',
					build: 'bun build src/index.ts --outdir dist --target node',
					start: 'bun run dist/index.js',
			  }
			: {
					dev: 'bun run --watch src/index.js',
					start: 'bun run src/index.js',
			  };
	}

	return baseScripts;
}

/**
 * Génère les devDependencies adaptées au gestionnaire de packages
 */
export function generateDevDependencies(
	packageManager: PackageManager,
	isTypeScript: boolean,
) {
	if (!isTypeScript) return {};

	const base = {
		'@types/node': '^20.0.0',
		typescript: '^5.0.0',
	};

	// Bun a son propre runtime TypeScript
	if (packageManager.name === 'bun') {
		return base; // Pas besoin de ts-node-dev avec bun
	}

	return {
		...base,
		'ts-node-dev': '^2.0.0',
	};
}

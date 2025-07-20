import { spawn, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface ServeOptions {
	port: string;
	watch: boolean;
}

export async function serveProject(options: ServeOptions) {
	console.log('🚀 Starting Atomik development server...');
	console.log(`📡 Port: ${options.port}`);
	console.log(`👁️  Watch mode: ${options.watch ? 'enabled' : 'disabled'}`);

	// Check if we're in an Atomik project
	const packageJsonPath = path.join(process.cwd(), 'package.json');
	if (!fs.existsSync(packageJsonPath)) {
		console.error('❌ No package.json found. Are you in an Atomik project?');
		process.exit(1);
	}

	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

	// Check for TypeScript or JavaScript
	const tsConfigExists = fs.existsSync(
		path.join(process.cwd(), 'tsconfig.json'),
	);
	const indexTS = fs.existsSync(path.join(process.cwd(), 'src', 'index.ts'));
	const indexJS = fs.existsSync(path.join(process.cwd(), 'src', 'index.js'));

	let command: string;
	let args: string[] = [];

	if (tsConfigExists && indexTS) {
		// TypeScript project
		console.log('📦 Detected TypeScript project');
		if (options.watch) {
			command = 'npx';
			args = ['ts-node-dev', '--respawn', '--transpile-only', 'src/index.ts'];
		} else {
			command = 'npx';
			args = ['ts-node', 'src/index.ts'];
		}
	} else if (indexJS) {
		// JavaScript project
		console.log('📦 Detected JavaScript project');
		if (
			(options.watch && process.version.startsWith('v18')) ||
			process.version.startsWith('v20')
		) {
			command = 'node';
			args = ['--watch', 'src/index.js'];
		} else {
			command = 'node';
			args = ['src/index.js'];
		}
	} else {
		console.error('❌ No src/index.ts or src/index.js found!');
		process.exit(1);
	}

	// Set port environment variable
	process.env.PORT = options.port;

	// Start the server
	const child = spawn(command, args, {
		stdio: 'inherit',
		env: { ...process.env, PORT: options.port },
	});

	// Handle process termination
	process.on('SIGINT', () => {
		console.log('\n🛑 Shutting down development server...');
		child.kill('SIGINT');
		process.exit(0);
	});

	child.on('error', error => {
		console.error('❌ Failed to start development server:', error.message);
		process.exit(1);
	});

	child.on('exit', code => {
		if (code !== 0) {
			console.error(`❌ Development server exited with code ${code}`);
		}
		process.exit(code || 0);
	});
}

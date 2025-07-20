import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface BuildOptions {
	output: string;
}

export async function buildProject(options: BuildOptions) {
	console.log('🔨 Building Atomik project for production...');
	console.log(`📁 Output directory: ${options.output}`);

	// Check if we're in an Atomik project
	const packageJsonPath = path.join(process.cwd(), 'package.json');
	if (!fs.existsSync(packageJsonPath)) {
		console.error('❌ No package.json found. Are you in an Atomik project?');
		process.exit(1);
	}

	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
	const tsConfigExists = fs.existsSync(
		path.join(process.cwd(), 'tsconfig.json'),
	);

	try {
		if (tsConfigExists) {
			// TypeScript build
			console.log('📦 Building TypeScript project...');
			execSync('npx tsc', { stdio: 'inherit' });

			// Copy non-TS files if they exist
			const publicDir = path.join(process.cwd(), 'public');
			if (fs.existsSync(publicDir)) {
				console.log('📄 Copying static files...');
				execSync(`cp -r public ${options.output}/`, { stdio: 'inherit' });
			}
		} else {
			// JavaScript - just copy files
			console.log('📦 Copying JavaScript files...');
			const srcExists = fs.existsSync(path.join(process.cwd(), 'src'));

			if (!srcExists) {
				console.error('❌ No src directory found!');
				process.exit(1);
			}

			// Create output directory
			if (!fs.existsSync(options.output)) {
				fs.mkdirSync(options.output, { recursive: true });
			}

			// Copy source files
			execSync(`cp -r src/* ${options.output}/`, { stdio: 'inherit' });

			// Copy public files if they exist
			const publicDir = path.join(process.cwd(), 'public');
			if (fs.existsSync(publicDir)) {
				execSync(`cp -r public ${options.output}/`, { stdio: 'inherit' });
			}
		}

		console.log('✅ Build completed successfully!');
		console.log(`
🚀 Production build ready in ${options.output}/

To start production server:
   npm start

Or manually:
   node ${options.output}/index.js
		`);
	} catch (error) {
		console.error('❌ Build failed:', error);
		process.exit(1);
	}
}

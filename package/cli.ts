#!/usr/bin/env node

import { program } from 'commander';
import { createProject } from './commands/create';
import { serveProject } from './commands/serve';
import { buildProject } from './commands/build';
import * as path from 'path';
import * as fs from 'fs';

// Read package.json from the correct location
const packageJsonPath = path.resolve(__dirname, '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

program
	.name('atomik')
	.description('CLI for Atomik - The ultra-fast web framework')
	.version(packageJson.version);

program
	.command('create')
	.description('Create a new Atomik project')
	.argument('<project-name>', 'Name of the project')
	.option(
		'-t, --template <template>',
		'Template to use (basic, api, full)',
		'basic',
	)
	.option('--typescript', 'Use TypeScript (default)', true)
	.option('--javascript', 'Use JavaScript instead of TypeScript')
	.action(createProject);

program
	.command('dev')
	.description('Start development server')
	.option('-p, --port <port>', 'Port to run on', '3000')
	.option('-w, --watch', 'Watch for file changes', true)
	.action(serveProject);

program
	.command('build')
	.description('Build the project for production')
	.option('-o, --output <dir>', 'Output directory', 'dist')
	.action(buildProject);

program
	.command('start')
	.description('Start production server')
	.option('-p, --port <port>', 'Port to run on', '3000')
	.action(options => {
		console.log('🚀 Starting production server...');
		// Implementation for production start
	});

program.parse();

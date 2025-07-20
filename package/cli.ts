#!/usr/bin/env node

import { program } from 'commander';
import { createProject } from './commands/create';
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
	.option('--typescript', 'Use TypeScript (default)', true)
	.option('--javascript', 'Use JavaScript instead of TypeScript')
	.action(createProject);

program.parse();

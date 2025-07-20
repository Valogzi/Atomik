import * as fs from 'fs';
import * as path from 'path';
import {
	detectPackageManager,
	installDependencies,
	generateScripts,
	generateDevDependencies,
} from '../utils/package-manager';

export interface CreateOptions {
	typescript?: boolean;
	javascript?: boolean;
}

export async function createProject(
	projectName: string,
	options: CreateOptions,
) {
	console.log(`🎯 Creating new Atomik project: ${projectName}`);
	console.log(
		`📦 Language: ${options.javascript ? 'JavaScript' : 'TypeScript'}`,
	);

	const projectPath = path.resolve(process.cwd(), projectName);

	// Check if directory already exists
	if (fs.existsSync(projectPath)) {
		console.error(`❌ Directory ${projectName} already exists!`);
		process.exit(1);
	}

	// Create project directory
	fs.mkdirSync(projectPath, { recursive: true });

	try {
		// Create project structure
		await createProjectStructure(projectPath, options);

		// Copy template files
		await copyTemplateFiles(projectPath, 'basic', options.javascript);

		// Initialize package.json
		await createPackageJson(projectPath, projectName, options);

		// Install dependencies
		const packageManager = detectPackageManager(projectPath);
		installDependencies(packageManager, projectPath);

		console.log('✅ Project created successfully!');

		const runCmd = packageManager.runCommand;

		console.log(`
🚀 Quick start:
   cd ${projectName}
   ${runCmd} dev

📚 Available commands:
   ${runCmd} dev     - Start development server
   ${runCmd} build   - Build for production  
   ${runCmd} start   - Start production server
		`);
	} catch (error) {
		console.error('❌ Error creating project:', error);
		// Clean up on error
		if (fs.existsSync(projectPath)) {
			fs.rmSync(projectPath, { recursive: true, force: true });
		}
		process.exit(1);
	}
}

async function createProjectStructure(
	projectPath: string,
	options: CreateOptions,
) {
	const dirs = ['src', 'src/routes', 'src/middleware', 'src/utils', 'public'];

	dirs.forEach(dir => {
		fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
	});
}

async function copyTemplateFiles(
	projectPath: string,
	template: string,
	useJS?: boolean,
) {
	const ext = useJS ? 'js' : 'ts';

	// Template files based on template type
	const files = getTemplateFiles(template, ext);

	for (const [filePath, content] of Object.entries(files)) {
		const fullPath = path.join(projectPath, filePath);
		fs.mkdirSync(path.dirname(fullPath), { recursive: true });
		fs.writeFileSync(fullPath, content);
	}
}

function getTemplateFiles(
	template: string,
	ext: string,
): Record<string, string> {
	const isTS = ext === 'ts';

	const commonFiles = {
		[`src/index.${ext}`]: getMainTemplate(template, isTS),
		'README.md': getReadmeTemplate(),
		'.gitignore': getGitignoreTemplate(),
		...(isTS && { 'tsconfig.json': getTsConfigTemplate() }),
	};

	return commonFiles;
}

function getMainTemplate(template: string, isTS: boolean): string {
	const importType = isTS
		? "import { Atomik, cors } from 'atomikjs';"
		: "const { Atomik, cors } = require('atomikjs');";

	return `${importType}

const app = new Atomik({
	port: 3000,
	callback: () => {
		console.log('🚀 Server running on http://localhost:3000');
	},
});

app.get('/', c => {
	return c.text('Hello, Atomik! 🚀');
});

app.get('/json', c => {
	return c.json({ message: 'Hello from Atomik API!' });
});

app.get('/html', c => {
	return c.html('<h1>Welcome to Atomik</h1><p>Ultra-fast web framework</p>');
});`;
}

function getReadmeTemplate(): string {
	return `# Atomik Project

A new project created with Atomik CLI.

## Getting Started

\`\`\`bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
\`\`\`

## Project Structure

\`\`\`
src/
├── index.ts          # Main application file
├── routes/           # Route handlers
├── middleware/       # Custom middleware
└── utils/           # Utility functions

public/              # Static files
\`\`\`

## Learn More

- [Atomik Documentation](https://github.com/valogzi/atomik)
- [Atomik Examples](https://github.com/valogzi/atomik/tree/main/src/exemples)
`;
}

function getGitignoreTemplate(): string {
	return `node_modules/
dist/
build/
*.log
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
`;
}

function getTsConfigTemplate(): string {
	return `{
	"compilerOptions": {
		"target": "ES2020",
		"module": "commonjs",
		"lib": ["ES2020"],
		"outDir": "./dist",
		"rootDir": "./src",
		"strict": true,
		"esModuleInterop": true,
		"skipLibCheck": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"declaration": true,
		"declarationMap": true,
		"sourceMap": true
	},
	"include": ["src/**/*"],
	"exclude": ["node_modules", "dist"]
}
`;
}

async function createPackageJson(
	projectPath: string,
	projectName: string,
	options: CreateOptions,
) {
	const isTS = !options.javascript;
	const packageManager = detectPackageManager(projectPath);

	const packageJson = {
		name: projectName,
		version: '1.0.0',
		description: `A new Atomik project created with basic template`,
		main: isTS ? 'dist/index.js' : 'src/index.js',
		scripts: generateScripts(packageManager, isTS),
		keywords: ['atomik', 'web', 'framework'],
		author: '',
		license: 'MIT',
		dependencies: {
			atomikjs: '^1.0.0',
		},
		devDependencies: generateDevDependencies(packageManager, isTS),
		...(packageManager.name !== 'npm' && {
			packageManager: `${packageManager.name}@latest`,
		}),
	};

	fs.writeFileSync(
		path.join(projectPath, 'package.json'),
		JSON.stringify(packageJson, null, 2),
	);
}

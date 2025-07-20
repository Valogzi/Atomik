import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface CreateOptions {
	template: string;
	typescript?: boolean;
	javascript?: boolean;
}

const TEMPLATES = {
	basic: 'Basic Atomik project',
	api: 'REST API project',
	full: 'Full-stack project with middleware',
};

export async function createProject(
	projectName: string,
	options: CreateOptions,
) {
	console.log(`🎯 Creating new Atomik project: ${projectName}`);
	console.log(`📋 Template: ${options.template}`);
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
		await copyTemplateFiles(projectPath, options.template, options.javascript);

		// Initialize package.json
		await createPackageJson(projectPath, projectName, options);

		// Install dependencies
		console.log('📦 Installing dependencies...');
		process.chdir(projectPath);
		execSync('npm install', { stdio: 'inherit' });

		console.log('✅ Project created successfully!');
		console.log(`
🚀 Quick start:
   cd ${projectName}
   npm run dev

📚 Available commands:
   npm run dev     - Start development server
   npm run build   - Build for production  
   npm start       - Start production server
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
	const templateDir = path.resolve(__dirname, '../../templates', template);

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

	switch (template) {
		case 'api':
			return {
				...commonFiles,
				[`src/routes/users.${ext}`]: getUsersRouteTemplate(isTS),
				[`src/middleware/cors.${ext}`]: getCorsMiddlewareTemplate(isTS),
			};
		case 'full':
			return {
				...commonFiles,
				[`src/routes/api.${ext}`]: getApiRouteTemplate(isTS),
				[`src/routes/static.${ext}`]: getStaticRouteTemplate(isTS),
				[`src/middleware/logger.${ext}`]: getLoggerMiddlewareTemplate(isTS),
				[`src/middleware/cors.${ext}`]: getCorsMiddlewareTemplate(isTS),
				'public/index.html': getIndexHtmlTemplate(),
			};
		default: // basic
			return commonFiles;
	}
}

function getMainTemplate(template: string, isTS: boolean): string {
	const importType = isTS
		? "import { Atomik, cors } from 'atomik';"
		: "const { Atomik, cors } = require('atomik');";

	switch (template) {
		case 'api':
			return `${importType}
${
	isTS
		? "import { usersRouter } from './routes/users';"
		: "const { usersRouter } = require('./routes/users');"
}

const app = new Atomik({ port: 3000 });

// Middleware
app.use(cors());

// Routes
app.use('/api/users', usersRouter);

app.get('/', (c) => {
	return c.json({ 
		message: 'Welcome to Atomik API!',
		version: '1.0.0',
		endpoints: ['/api/users']
	});
});

console.log('🚀 API Server running on http://localhost:3000');
`;

		case 'full':
			return `${importType}
${
	isTS
		? `
import { apiRouter } from './routes/api';
import { staticRouter } from './routes/static';
import { logger } from './middleware/logger';
`
		: `
const { apiRouter } = require('./routes/api');
const { staticRouter } = require('./routes/static'); 
const { logger } = require('./middleware/logger');
`
}

const app = new Atomik({ port: 3000 });

// Global middleware
app.use(logger);
app.use(cors());

// Routes
app.use('/api', apiRouter);
app.use('/', staticRouter);

app.get('/health', (c) => {
	return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

console.log('🚀 Full-stack server running on http://localhost:3000');
`;

		default: // basic
			return `${importType}

const app = new Atomik({ port: 3000 });

app.get('/', (c) => {
	return c.text('Hello, Atomik! 🚀');
});

app.get('/json', (c) => {
	return c.json({ message: 'Hello from Atomik API!' });
});

app.get('/html', (c) => {
	return c.html('<h1>Welcome to Atomik</h1><p>Ultra-fast web framework</p>');
});

console.log('🚀 Server running on http://localhost:3000');
`;
	}
}

function getUsersRouteTemplate(isTS: boolean): string {
	const routerImport = isTS
		? "import { Router } from 'atomik';"
		: "const { Router } = require('atomik');";
	const exportSyntax = isTS
		? 'export const usersRouter = router;'
		: 'module.exports = { usersRouter: router };';

	return `${routerImport}

const router = new Router();

// Sample users data
const users = [
	{ id: 1, name: 'John Doe', email: 'john@example.com' },
	{ id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

router.get('/', (c) => {
	return c.json(users);
});

router.get('/:id', (c) => {
	const id = parseInt(c.params.id);
	const user = users.find(u => u.id === id);
	
	if (!user) {
		return c.status(404).json({ error: 'User not found' });
	}
	
	return c.json(user);
});

router.post('/', (c) => {
	// In a real app, you'd parse the request body
	const newUser = { 
		id: users.length + 1, 
		name: 'New User', 
		email: 'new@example.com' 
	};
	users.push(newUser);
	
	return c.status(201).json(newUser);
});

${exportSyntax}
`;
}

function getCorsMiddlewareTemplate(isTS: boolean): string {
	const exportSyntax = isTS
		? 'export const corsMiddleware'
		: 'module.exports = { corsMiddleware';

	return `${
		isTS
			? "import { cors } from 'atomik';"
			: "const { cors } = require('atomik');"
	}

${exportSyntax} = cors({
	origin: ['http://localhost:3000', 'http://localhost:5173'],
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
});${!isTS ? ' };' : ''}
`;
}

function getLoggerMiddlewareTemplate(isTS: boolean): string {
	const contextImport = isTS ? "import { Context } from 'atomik';" : '';
	const functionType = isTS ? '(c: Context, next: () => void)' : '(c, next)';
	const exportSyntax = isTS
		? 'export const logger ='
		: 'module.exports = { logger:';

	return `${contextImport}

${exportSyntax} ${functionType} => {
	const start = Date.now();
	const method = c.req.method;
	const url = c.req.url;
	
	console.log(\`📥 \${method} \${url}\`);
	
	next();
	
	const duration = Date.now() - start;
	console.log(\`📤 \${method} \${url} - \${duration}ms\`);
};${!isTS ? ' };' : ''}
`;
}

function getApiRouteTemplate(isTS: boolean): string {
	const routerImport = isTS
		? "import { Router } from 'atomik';"
		: "const { Router } = require('atomik');";
	const exportSyntax = isTS
		? 'export const apiRouter = router;'
		: 'module.exports = { apiRouter: router };';

	return `${routerImport}

const router = new Router();

router.get('/status', (c) => {
	return c.json({ 
		status: 'active',
		timestamp: new Date().toISOString(),
		uptime: process.uptime()
	});
});

router.get('/info', (c) => {
	return c.json({
		name: 'Atomik API',
		version: '1.0.0',
		framework: 'Atomik'
	});
});

${exportSyntax}
`;
}

function getStaticRouteTemplate(isTS: boolean): string {
	const routerImport = isTS
		? "import { Router } from 'atomik';"
		: "const { Router } = require('atomik');";
	const exportSyntax = isTS
		? 'export const staticRouter = router;'
		: 'module.exports = { staticRouter: router };';

	return `${routerImport}

const router = new Router();

router.get('/', (c) => {
	return c.html(\`
<!DOCTYPE html>
<html>
<head>
	<title>Atomik App</title>
	<style>
		body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
		.header { text-align: center; color: #2563eb; }
		.card { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
	</style>
</head>
<body>
	<h1 class="header">⚛️ Welcome to Atomik</h1>
	<div class="card">
		<h2>Ultra-fast Web Framework</h2>
		<p>Your full-stack Atomik application is running!</p>
		<ul>
			<li><a href="/api/status">API Status</a></li>
			<li><a href="/api/info">API Info</a></li>
			<li><a href="/health">Health Check</a></li>
		</ul>
	</div>
</body>
</html>
	\`);
});

${exportSyntax}
`;
}

function getIndexHtmlTemplate(): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Atomik App</title>
</head>
<body>
	<h1>⚛️ Atomik Static Files</h1>
	<p>This is served from the public directory.</p>
</body>
</html>
`;
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

	const packageJson = {
		name: projectName,
		version: '1.0.0',
		description: `A new Atomik project created with ${options.template} template`,
		main: isTS ? 'dist/index.js' : 'src/index.js',
		scripts: {
			...(isTS && {
				dev: 'ts-node-dev --respawn --transpile-only src/index.ts',
				build: 'tsc',
				start: 'node dist/index.js',
			}),
			...(!isTS && {
				dev: 'node --watch src/index.js',
				start: 'node src/index.js',
			}),
		},
		keywords: ['atomik', 'web', 'framework'],
		author: '',
		license: 'MIT',
		dependencies: {
			atomik: '^1.0.0',
		},
		devDependencies: {
			...(isTS && {
				'@types/node': '^20.0.0',
				'ts-node-dev': '^2.0.0',
				typescript: '^5.0.0',
			}),
		},
	};

	fs.writeFileSync(
		path.join(projectPath, 'package.json'),
		JSON.stringify(packageJson, null, 2),
	);
}

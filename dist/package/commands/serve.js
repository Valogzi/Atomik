"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveProject = serveProject;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function serveProject(options) {
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
    const tsConfigExists = fs.existsSync(path.join(process.cwd(), 'tsconfig.json'));
    const indexTS = fs.existsSync(path.join(process.cwd(), 'src', 'index.ts'));
    const indexJS = fs.existsSync(path.join(process.cwd(), 'src', 'index.js'));
    let command;
    let args = [];
    if (tsConfigExists && indexTS) {
        // TypeScript project
        console.log('📦 Detected TypeScript project');
        if (options.watch) {
            command = 'npx';
            args = ['ts-node-dev', '--respawn', '--transpile-only', 'src/index.ts'];
        }
        else {
            command = 'npx';
            args = ['ts-node', 'src/index.ts'];
        }
    }
    else if (indexJS) {
        // JavaScript project
        console.log('📦 Detected JavaScript project');
        if ((options.watch && process.version.startsWith('v18')) ||
            process.version.startsWith('v20')) {
            command = 'node';
            args = ['--watch', 'src/index.js'];
        }
        else {
            command = 'node';
            args = ['src/index.js'];
        }
    }
    else {
        console.error('❌ No src/index.ts or src/index.js found!');
        process.exit(1);
    }
    // Set port environment variable
    process.env.PORT = options.port;
    // Start the server
    const child = (0, child_process_1.spawn)(command, args, {
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

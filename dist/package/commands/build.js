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
exports.buildProject = buildProject;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function buildProject(options) {
    console.log('🔨 Building Atomik project for production...');
    console.log(`📁 Output directory: ${options.output}`);
    // Check if we're in an Atomik project
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        console.error('❌ No package.json found. Are you in an Atomik project?');
        process.exit(1);
    }
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const tsConfigExists = fs.existsSync(path.join(process.cwd(), 'tsconfig.json'));
    try {
        if (tsConfigExists) {
            // TypeScript build
            console.log('📦 Building TypeScript project...');
            (0, child_process_1.execSync)('npx tsc', { stdio: 'inherit' });
            // Copy non-TS files if they exist
            const publicDir = path.join(process.cwd(), 'public');
            if (fs.existsSync(publicDir)) {
                console.log('📄 Copying static files...');
                (0, child_process_1.execSync)(`cp -r public ${options.output}/`, { stdio: 'inherit' });
            }
        }
        else {
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
            (0, child_process_1.execSync)(`cp -r src/* ${options.output}/`, { stdio: 'inherit' });
            // Copy public files if they exist
            const publicDir = path.join(process.cwd(), 'public');
            if (fs.existsSync(publicDir)) {
                (0, child_process_1.execSync)(`cp -r public ${options.output}/`, { stdio: 'inherit' });
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
    }
    catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

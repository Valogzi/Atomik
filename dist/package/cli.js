#!/usr/bin/env node
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
const commander_1 = require("commander");
const create_1 = require("./commands/create");
const serve_1 = require("./commands/serve");
const build_1 = require("./commands/build");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// Read package.json from the correct location
const packageJsonPath = path.resolve(__dirname, '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
commander_1.program
    .name('atomik')
    .description('CLI for Atomik - The ultra-fast web framework')
    .version(packageJson.version);
commander_1.program
    .command('create')
    .description('Create a new Atomik project')
    .argument('<project-name>', 'Name of the project')
    .option('--typescript', 'Use TypeScript (default)', true)
    .option('--javascript', 'Use JavaScript instead of TypeScript')
    .action(create_1.createProject);
commander_1.program
    .command('dev')
    .description('Start development server')
    .option('-p, --port <port>', 'Port to run on', '3000')
    .option('-w, --watch', 'Watch for file changes', true)
    .action(serve_1.serveProject);
commander_1.program
    .command('build')
    .description('Build the project for production')
    .option('-o, --output <dir>', 'Output directory', 'dist')
    .action(build_1.buildProject);
commander_1.program
    .command('start')
    .description('Start production server')
    .option('-p, --port <port>', 'Port to run on', '3000')
    .action(options => {
    console.log('🚀 Starting production server...');
    // Implementation for production start
});
commander_1.program.parse();

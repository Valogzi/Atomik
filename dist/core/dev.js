"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const chokidar_1 = __importDefault(require("chokidar"));
let server = null;
// Lance le serveur Node.js (dist/index.js)
function startServer() {
    if (server) {
        console.log('🔁 Killing previous server...');
        server.kill();
    }
    console.log('🚀 Starting server...');
    server = (0, child_process_1.spawn)('node', ['dist/index.js'], { stdio: 'inherit' });
    server.on('close', code => {
        if (code !== null && code !== 0) {
            console.error(`❌ Server exited with code ${code}`);
        }
    });
}
// Lancer la compilation TypeScript en mode --watch
const tsc = (0, child_process_1.spawn)('tsc', ['--watch'], { stdio: 'inherit' });
// Watch dist/ pour restart le serveur
chokidar_1.default.watch('./dist').on('change', () => {
    console.log('📦 File changed. Reloading server...');
    startServer();
});
// Lancer une première fois
startServer();
// Nettoyage si process tué (CTRL+C)
process.on('SIGINT', () => {
    if (server)
        server.kill();
    if (tsc)
        tsc.kill();
    process.exit();
});

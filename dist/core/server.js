"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const http_1 = __importDefault(require("http"));
function createServer(router) {
    return http_1.default.createServer((req, res) => {
        router.handle(req, res);
    });
}

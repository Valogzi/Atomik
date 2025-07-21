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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Atomik = exports.Router = void 0;
const router_1 = require("./core/router");
// Export des plugins
__exportStar(require("./plugins"), exports);
var router_2 = require("./core/router");
Object.defineProperty(exports, "Router", { enumerable: true, get: function () { return router_2.Router; } });
class Atomik extends router_1.Router {
    constructor() {
        super();
    }
    async fetch(req) {
        let status = 200;
        let headers = {};
        let body = null;
        const fakeRes = {
            statusCode: 200,
            setHeader: (key, value) => {
                headers[key] = value;
            },
            end: (data) => {
                body = data ?? null;
            },
            writeHead: (code, hdrs) => {
                status = code;
                headers = { ...headers, ...hdrs };
            },
        };
        const res = await this.handleMiddleware(req, fakeRes);
        // Si handleMiddleware a retourné une vraie Response, utilise-la
        if (res instanceof Response) {
            return res;
        }
        // Sinon, on construit la réponse manuellement (Node fallback)
        return new Response(body, {
            status,
            headers,
        });
    }
}
exports.Atomik = Atomik;

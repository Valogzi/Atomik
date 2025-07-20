"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const request_1 = require("./request");
const response_1 = require("./response");
class Router {
    constructor() {
        this.routes = {};
    }
    get(path, handler) {
        this.routes[`GET ${path}`] = handler;
    }
    post(path, handler) {
        this.routes[`POST ${path}`] = handler;
    }
    put(path, handler) {
        this.routes[`PUT ${path}`] = handler;
    }
    patch(path, handler) {
        this.routes[`PATCH ${path}`] = handler;
    }
    delete(path, handler) {
        this.routes[`DELETE ${path}`] = handler;
    }
    handle(req, res) {
        const key = `${req.method} ${req.url}`;
        const handler = this.routes[key];
        if (handler) {
            handler((0, request_1.createRequest)(req), (0, response_1.createResponse)(res)); // Appel de la fonction de gestion
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    }
}
exports.Router = Router;

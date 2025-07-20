"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const context_1 = require("./context");
class Router {
    constructor() {
        this.routes = {};
        this.middlewares = [];
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
            handler((0, context_1.createContext)(req, res)); // Appel de la fonction de gestion
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    }
    handleMiddleware(req, res) {
        let i = 0;
        const runMiddleware = () => {
            if (i < this.middlewares.length) {
                const mw = this.middlewares[i++];
                mw(req, res, runMiddleware);
            }
            else {
                this.handle(req, res); // nouvelle méthode pour ne pas appeler handle récursivement
            }
        };
        runMiddleware();
    }
    use(middleware) {
        this.middlewares.push(middleware);
    }
}
exports.Router = Router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const context_1 = require("./context");
class Router {
    constructor() {
        this.routes = {};
        this.middlewares = [];
    }
    addRoute(method, path, handler) {
        if (!this.routes[method]) {
            this.routes[method] = [];
        }
        // Convertir /post/:id en regex et extraire les noms de paramètres
        const paramNames = [];
        const regexPattern = path.replace(/:([a-zA-Z_$][a-zA-Z0-9_$]*)/g, (_, paramName) => {
            paramNames.push(paramName);
            return '([^/]+)';
        });
        const regex = new RegExp(`^${regexPattern}$`);
        this.routes[method].push({
            pattern: path,
            regex,
            paramNames,
            handler,
        });
    }
    use(middleware) {
        this.middlewares.push(middleware);
    }
    get(path, handler) {
        this.addRoute('GET', path, handler);
    }
    post(path, handler) {
        this.addRoute('POST', path, handler);
    }
    put(path, handler) {
        this.addRoute('PUT', path, handler);
    }
    patch(path, handler) {
        this.addRoute('PATCH', path, handler);
    }
    delete(path, handler) {
        this.addRoute('DELETE', path, handler);
    }
    handle(req, res) {
        const method = req.method || 'GET';
        const url = req.url
            ? new URL(req.url, `http://${req.headers.host}`).pathname
            : '/';
        const methodRoutes = this.routes[method] || [];
        for (const route of methodRoutes) {
            const match = url.match(route.regex);
            if (match) {
                // Extraire les paramètres
                const params = {};
                route.paramNames.forEach((name, index) => {
                    params[name] = match[index + 1];
                });
                const context = (0, context_1.createContext)(req, res, params);
                return route.handler(context);
            }
        }
        // Aucune route trouvée
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
    handleMiddleware(req, res) {
        let i = 0;
        const runMiddleware = () => {
            if (i < this.middlewares.length) {
                const mw = this.middlewares[i++];
                mw((0, context_1.createContext)(req, res), runMiddleware);
            }
            else {
                this.handle(req, res); // nouvelle méthode pour ne pas appeler handle récursivement
            }
        };
        runMiddleware();
    }
}
exports.Router = Router;

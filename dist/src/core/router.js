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
        const logic = (method) => {
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
        };
        if (method instanceof Array) {
            method.forEach(m => logic(m));
        }
        else {
            logic(method);
        }
    }
    use(arg1, arg2) {
        if (typeof arg1 === 'string' && typeof arg2 === 'function') {
            this.middlewares.push({ path: arg1, handler: arg2 });
        }
        else if (typeof arg1 === 'function') {
            this.middlewares.push({ path: null, handler: arg1 });
        }
        else {
            throw new Error('Invalid arguments for use()');
        }
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
    options(path, handler) {
        this.addRoute('OPTIONS', path, handler);
    }
    head(path, handler) {
        this.addRoute('HEAD', path, handler);
    }
    all(path, handler) {
        this.addRoute(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], path, handler);
    }
    route(path, handle) {
        const routes = handle.routes;
        const checkPathSlash = path === '/' ? '' : path;
        handle.middlewares.forEach(mw => {
            if (mw.path !== null) {
                mw.path = checkPathSlash + mw.path; // Préfixer le chemin du middleware
            }
            else {
                mw.path = checkPathSlash; // Middleware sans chemin spécifique
            }
            this.middlewares.push(mw);
        });
        // this.middlewares = [...this.middlewares, ...handle.middlewares];
        handle.middlewares = []; // Nettoyer les middlewares de l'instance Atomik
        Object.keys(routes).forEach(method => {
            routes[method].forEach(route => {
                if (route.pattern.endsWith('/')) {
                    route.pattern = route.pattern.slice(0, -1); // Enlever le slash final
                }
                const fullRoute = checkPathSlash + route.pattern;
                this.addRoute(method, fullRoute, route.handler);
            });
            delete routes[method]; // Nettoyer les routes après les avoir ajoutées
        });
    }
    async handle(req, res, ctx) {
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
                ctx.params = params; // Mettre à jour le contexte avec les paramètres
                const res = await Promise.resolve(route.handler(ctx));
                if (res instanceof Response) {
                    return res;
                }
                return;
            }
        }
        // Aucune route trouvée
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
    async handleMiddleware(req, res) {
        let i = 0;
        const ctx = (0, context_1.createContext)(req, res);
        const url = ctx.url;
        const runMiddleware = async () => {
            if (i < this.middlewares.length) {
                const mw = this.middlewares[i++];
                if (mw.path !== null) {
                    if (url && url.startsWith(mw.path)) {
                        return await Promise.resolve(mw.handler(ctx, runMiddleware));
                    }
                    if (url &&
                        url.startsWith(mw.path.replace('*', '').replace(/\/$/, ''))) {
                        return await Promise.resolve(mw.handler(ctx, runMiddleware));
                    }
                    return await runMiddleware(); // Passer au middleware suivant
                }
                return await Promise.resolve(mw.handler(ctx, runMiddleware));
            }
            else {
                return await this.handle(req, res, ctx); // nouvelle méthode pour ne pas appeler handle récursivement
            }
        };
        return await runMiddleware();
    }
}
exports.Router = Router;

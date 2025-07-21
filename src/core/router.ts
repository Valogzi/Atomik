import { IncomingMessage, ServerResponse } from 'http';
import { Context, createContext } from './context';
import { Atomik } from '..';
import { edgeContext } from '../types';

type RouterHandler = (
	c: Context | edgeContext,
) => void | Response | Promise<void | Response>;

export type Middleware = (
	c: Context,
	next: () => void,
) => Promise<Response | undefined>;

interface Route {
	pattern: string;
	regex: RegExp;
	paramNames: string[];
	handler: RouterHandler;
}

export class Router {
	routes: Record<string, Route[]> = {};
	middlewares: Middleware[] = [];

	private addRoute(
		method: string | string[],
		path: string,
		handler: RouterHandler,
	) {
		const logic = (method: string) => {
			if (!this.routes[method]) {
				this.routes[method] = [];
			}
			// Convertir /post/:id en regex et extraire les noms de paramètres
			const paramNames: string[] = [];
			const regexPattern = path.replace(
				/:([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
				(_, paramName) => {
					paramNames.push(paramName);
					return '([^/]+)';
				},
			);

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
		} else {
			logic(method);
		}
	}

	use(middleware: Middleware) {
		this.middlewares.push(middleware);
	}

	get(path: string, handler: RouterHandler) {
		this.addRoute('GET', path, handler);
	}
	post(path: string, handler: RouterHandler) {
		this.addRoute('POST', path, handler);
	}
	put(path: string, handler: RouterHandler) {
		this.addRoute('PUT', path, handler);
	}
	patch(path: string, handler: RouterHandler) {
		this.addRoute('PATCH', path, handler);
	}
	delete(path: string, handler: RouterHandler) {
		this.addRoute('DELETE', path, handler);
	}
	options(path: string, handler: RouterHandler) {
		this.addRoute('OPTIONS', path, handler);
	}
	head(path: string, handler: RouterHandler) {
		this.addRoute('HEAD', path, handler);
	}
	all(path: string, handler: RouterHandler) {
		this.addRoute(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], path, handler);
	}
	route(path: string, handle: Atomik) {
		const routes = handle.routes;
		const checkPathSlash = path === '/' ? '' : path;

		this.middlewares = handle.middlewares;
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

	async handle(req: IncomingMessage, res: ServerResponse, ctx: Context) {
		const method = req.method || 'GET';
		const url = req.url
			? new URL(req.url, `http://${req.headers.host}`).pathname
			: '/';

		const methodRoutes = this.routes[method] || [];

		for (const route of methodRoutes) {
			const match = url.match(route.regex);
			if (match) {
				// Extraire les paramètres
				const params: Record<string, string> = {};
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

	async handleMiddleware(req: IncomingMessage, res: ServerResponse) {
		let i = 0;
		const ctx = createContext(req, res);

		const runMiddleware = async () => {
			if (i < this.middlewares.length) {
				const mw = this.middlewares[i++];
				return await Promise.resolve(mw(ctx, runMiddleware));
			} else {
				return await this.handle(req, res, ctx); // nouvelle méthode pour ne pas appeler handle récursivement
			}
		};

		return await runMiddleware();
	}
}

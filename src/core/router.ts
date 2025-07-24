import { IncomingMessage, ServerResponse } from 'http';
import { Context, createContext } from './context';
import { Atomik } from '..';
import {
	MiddlewareEntry,
	MiddlewareFunction,
	Route,
	RouteHandler,
} from '../types';

export class Router {
	routes: Record<string, Route[]> = {};
	middlewares: MiddlewareEntry[] = [];
	base: string = '';

	private addRoute(
		method: string | string[],
		path: string,
		handler: RouteHandler,
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

	use(middleware: MiddlewareFunction): void;
	use(path: string, middleware: MiddlewareFunction): void;
	use(arg1: string | MiddlewareFunction, arg2?: MiddlewareFunction): void {
		if (typeof arg1 === 'string' && typeof arg2 === 'function') {
			this.middlewares.push({ path: this.base + arg1, handler: arg2 });
		} else if (typeof arg1 === 'function') {
			this.middlewares.push({ path: null, handler: arg1 });
		} else {
			throw new Error('Invalid arguments for use()');
		}
	}

	basePath(path: string) {
		this.base = path.endsWith('/') ? path.slice(0, -1) : path;
		return this;
	}

	get(path: string, handler: RouteHandler) {
		this.addRoute('GET', this.base + path, handler);
	}
	post(path: string, handler: RouteHandler) {
		this.addRoute('POST', this.base + path, handler);
	}
	put(path: string, handler: RouteHandler) {
		this.addRoute('PUT', this.base + path, handler);
	}
	patch(path: string, handler: RouteHandler) {
		this.addRoute('PATCH', this.base + path, handler);
	}
	delete(path: string, handler: RouteHandler) {
		this.addRoute('DELETE', this.base + path, handler);
	}
	options(path: string, handler: RouteHandler) {
		this.addRoute('OPTIONS', this.base + path, handler);
	}
	head(path: string, handler: RouteHandler) {
		this.addRoute('HEAD', this.base + path, handler);
	}
	all(path: string, handler: RouteHandler) {
		this.addRoute(
			['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
			this.base + path,
			handler,
		);
	}
	route(path: string, handle: Atomik) {
		const routes = handle.routes;
		const routePath = path === '/' ? '' : path; // Traiter le cas de la racine

		const checkPathSlash =
			path === '/' && this.base === ''
				? ''
				: this.base + routePath === '/'
				? ''
				: this.base + routePath;
		handle.middlewares.forEach(mw => {
			if (mw.path !== null) {
				mw.path = checkPathSlash + mw.path; // Préfixer le chemin du middleware
			} else {
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
				this.addRoute(
					method,
					fullRoute === '' ? '/' : fullRoute,
					route.handler,
				);
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
			const filterExistedPath =
				methodRoutes.filter(r => {
					return r.pattern === route.pattern;
				}).length > 1;

			if (filterExistedPath) {
				throw new Error(
					`Route conflict detected for path: ${route.pattern} with method: ${method}`,
				);
			}
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
		const url = ctx.url;

		const runMiddleware = async () => {
			if (i < this.middlewares.length) {
				const mw = this.middlewares[i++];
				if (mw.path !== null) {
					if (url && url.startsWith(mw.path)) {
						return await Promise.resolve(mw.handler(ctx, runMiddleware));
					}
					if (
						url &&
						url.startsWith(mw.path.replace('*', '').replace(/\/$/, ''))
					) {
						return await Promise.resolve(mw.handler(ctx, runMiddleware));
					}

					return await runMiddleware(); // Passer au middleware suivant
				}
				return await Promise.resolve(mw.handler(ctx, runMiddleware));
			} else {
				return await this.handle(req, res, ctx); // nouvelle méthode pour ne pas appeler handle récursivement
			}
		};

		return await runMiddleware();
	}
}

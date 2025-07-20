import { IncomingMessage, ServerResponse } from 'http';
import { Context, createContext } from './context';

type RouterHandler = (c: Context) => void;

export type Middleware = (c: Context, next: () => void) => void;

interface Route {
	pattern: string;
	regex: RegExp;
	paramNames: string[];
	handler: RouterHandler;
}

export class Router {
	routes: Record<string, Route[]> = {};
	middlewares: Middleware[] = [];

	private addRoute(method: string, path: string, handler: RouterHandler) {
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

	handle(req: IncomingMessage, res: ServerResponse) {
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

				const context = createContext(req, res, params);
				return route.handler(context);
			}
		}

		// Aucune route trouvée
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('Not Found');
	}

	handleMiddleware(req: IncomingMessage, res: ServerResponse) {
		let i = 0;

		const runMiddleware = () => {
			if (i < this.middlewares.length) {
				const mw = this.middlewares[i++];
				mw(createContext(req, res), runMiddleware);
			} else {
				this.handle(req, res); // nouvelle méthode pour ne pas appeler handle récursivement
			}
		};

		runMiddleware();
	}

	use(middleware: Middleware) {
		this.middlewares.push(middleware);
	}
}

import { IncomingMessage, ServerResponse } from 'http';
import { Context, createContext } from './context';

type RouterHandler = (c: Context) => void;

export type Middleware = (
	req: IncomingMessage,
	res: ServerResponse,
	next: () => void,
) => void;

export class Router {
	routes: Record<string, RouterHandler> = {};
	middlewares: Middleware[] = [];

	get(path: string, handler: RouterHandler) {
		this.routes[`GET ${path}`] = handler;
	}
	post(path: string, handler: RouterHandler) {
		this.routes[`POST ${path}`] = handler;
	}
	put(path: string, handler: RouterHandler) {
		this.routes[`PUT ${path}`] = handler;
	}
	patch(path: string, handler: RouterHandler) {
		this.routes[`PATCH ${path}`] = handler;
	}
	delete(path: string, handler: RouterHandler) {
		this.routes[`DELETE ${path}`] = handler;
	}

	handle(req: IncomingMessage, res: ServerResponse) {
		const key = `${req.method} ${req.url}`;
		const handler = this.routes[key];

		if (handler) {
			handler(createContext(req, res)); // Appel de la fonction de gestion
		} else {
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			res.end('Not Found');
		}
	}

	handleMiddleware(req: IncomingMessage, res: ServerResponse) {
		let i = 0;

		const runMiddleware = () => {
			if (i < this.middlewares.length) {
				const mw = this.middlewares[i++];
				mw(req, res, runMiddleware);
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

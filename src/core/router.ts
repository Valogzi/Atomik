import { IncomingMessage, ServerResponse } from 'http';
import { createRequest, Request } from './request';
import { createResponse, Response } from './response';

type RouterHandler = (req: Request, res: Response) => void;

export class Router {
	private routes: Record<string, RouterHandler> = {};

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
			handler(createRequest(req), createResponse(res)); // Appel de la fonction de gestion
		} else {
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			res.end('Not Found');
		}
	}
}

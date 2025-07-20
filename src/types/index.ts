import { IncomingMessage, ServerResponse } from 'http';

export interface Context {
	req: IncomingMessage;
	res: ServerResponse;
	url: string | null;
	method: string;
	params: Record<string, string>;
	query: URLSearchParams;
	text(text: string): ServerResponse<IncomingMessage>;
	json(data: any): ServerResponse<IncomingMessage>;
	html(html: string): ServerResponse<IncomingMessage>;
	status(code: number): Context;
	redirect(url: string): void;
}

export interface MiddlewareFunction {
	(c: Context, next?: void): void;
}

export interface RouteHandler {
	(c: Context): void;
}

export interface AtomikOptions {
	port?: number;
	callback?: () => void;
}

export interface CorsOptions {
	origin?: string | string[] | boolean;
	methods?: string[];
	allowedHeaders?: string[];
	credentials?: boolean;
	maxAge?: number;
}

export interface Router {
	get(path: string, handler: RouteHandler): void;
	post(path: string, handler: RouteHandler): void;
	put(path: string, handler: RouteHandler): void;
	delete(path: string, handler: RouteHandler): void;
	patch(path: string, handler: RouteHandler): void;
	options(path: string, handler: RouteHandler): void;
	head(path: string, handler: RouteHandler): void;
	use(middleware: MiddlewareFunction): void;
}

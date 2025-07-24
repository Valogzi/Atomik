import { IncomingMessage, ServerResponse } from 'http';
import { Atomik } from '../../index';

export interface Context {
	req: IncomingMessage;
	res: ServerResponse;
	url: string | null;
	method: string;
	params: Record<string, string>;
	body: Promise<any>;
	query: URLSearchParams;
	text(text: string): void;
	json(data: any): void;
	html(html: string): void;
	set(header: string, value: string): Context;
	send(body: string | object): void;
	status(code: number): Context;
	redirect(url: string): void;
}

export interface edgeContext {
	req: Request;
	res: Response;
	url: string;
	method: string;
	params: Record<string, string>;
	body: Promise<any>;
	query: URLSearchParams;
	text: (body: string) => Response;
	json: (body: object) => Response;
	html: (htmlElement: string) => Response;
	set(header: string, value: string, body?: string | object): edgeContext;
	send(body: string | object): Response;
	status: (code: number, body?: string | object) => edgeContext;
	redirect: (url: string) => Response;
}

export interface MiddlewareFunction {
	(c: Context | edgeContext, next: () => void):
		| Promise<Response | undefined>
		| Response
		| void
		| Promise<void>;
}

export interface MiddlewareEntry {
	path: string | null;
	handler: MiddlewareFunction;
}

export interface Route {
	pattern: string;
	regex: RegExp;
	paramNames: string[];
	handler: RouteHandler;
}

export interface RouteHandler {
	(c: Context | edgeContext): void | Response | Promise<void | Response>;
}

export interface CorsOptions {
	origin?: string | string[] | boolean;
	methods?: string[];
	allowedHeaders?: string[];
	credentials?: boolean;
	maxAge?: number;
}

export interface serveOptions {
	app: Atomik;
	port?: number;
}

export interface Router {
	// Middleware
	use(middleware: MiddlewareFunction): void;
	use(path: string, middleware: MiddlewareFunction): void;
	use(arg1: string | MiddlewareFunction, arg2?: MiddlewareFunction): void;

	// HTTP methods
	get(path: string, handler: RouteHandler): void;
	post(path: string, handler: RouteHandler): void;
	put(path: string, handler: RouteHandler): void;
	patch(path: string, handler: RouteHandler): void;
	delete(path: string, handler: RouteHandler): void;
	options(path: string, handler: RouteHandler): void;
	head(path: string, handler: RouteHandler): void;
	all(path: string, handler: RouteHandler): void;

	// route sub-router
	route(path: string, handler: Atomik): void;
}

import {
	Context,
	MiddlewareFunction,
	RouteHandler,
	CorsOptions,
	Router,
	serveOptions,
	edgeContext,
	MiddlewareEntry,
	Route,
} from './src/types';
import { Atomik as AtomikHandler } from './src/index';
import { IncomingMessage, ServerResponse } from 'http';

declare class Atomik implements Router {
	// Middleware
	use(middleware: MiddlewareFunction): void;
	use(path: string, middleware: MiddlewareFunction): void;
	use(arg1: string | MiddlewareFunction, arg2?: MiddlewareFunction): void;

	// HTTP Methods
	get(path: string, handler: RouteHandler): void;
	post(path: string, handler: RouteHandler): void;
	put(path: string, handler: RouteHandler): void;
	delete(path: string, handler: RouteHandler): void;
	patch(path: string, handler: RouteHandler): void;
	options(path: string, handler: RouteHandler): void;
	head(path: string, handler: RouteHandler): void;
	all(path: string, handler: RouteHandler): void;

	// route sub-router
	route(path: string, handler: AtomikHandler): void;

	// handler
	handleMiddleware(
		req: IncomingMessage,
		res: ServerResponse,
	): Promise<void | Response>;

	// cross-runtime fetch
	fetch(req: Request): Promise<Response>;
}

declare function cors(options?: CorsOptions): MiddlewareFunction;
declare function serve(options: serveOptions): void;

export {
	Atomik,
	cors,
	serve,
	Context,
	edgeContext,
	MiddlewareFunction,
	RouteHandler,
	CorsOptions,
	serveOptions,
	Router,
};

export default Atomik;

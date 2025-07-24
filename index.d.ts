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
	constructor();

	// properties
	routes: Record<string, Route[]>;
	middlewares: MiddlewareEntry[];
	private addRoute(): (
		method: string | string[],
		path: string,
		handler: RouteHandler,
	) => void;
	handle(
		req: IncomingMessage,
		res: ServerResponse,
		ctx: Context,
	): Promise<Response | undefined>;
	handleMiddleware(
		req: IncomingMessage,
		res: ServerResponse,
	): Promise<void | Response>;

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
	route(path: string, handler: AtomikHandler): void;

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

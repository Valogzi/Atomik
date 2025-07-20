import {
	Context,
	MiddlewareFunction,
	RouteHandler,
	AtomikOptions,
	CorsOptions,
	Router,
} from './src/types';

declare class Atomik implements Router {
	constructor(options?: AtomikOptions);

	// Middleware
	use(middleware: MiddlewareFunction): void;

	// HTTP Methods
	get(path: string, handler: RouteHandler): void;
	post(path: string, handler: RouteHandler): void;
	put(path: string, handler: RouteHandler): void;
	delete(path: string, handler: RouteHandler): void;
	patch(path: string, handler: RouteHandler): void;
	options(path: string, handler: RouteHandler): void;
	head(path: string, handler: RouteHandler): void;
}

declare function cors(options?: CorsOptions): MiddlewareFunction;

declare function createRouter(): Router;

export {
	Atomik,
	cors,
	createRouter,
	Context,
	MiddlewareFunction,
	RouteHandler,
	AtomikOptions,
	CorsOptions,
	Router,
};

export default Atomik;

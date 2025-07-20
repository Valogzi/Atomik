export interface Context {
	req: Request;
	res: Response;
	params: Record<string, string>;
	json(data: any): Response;
	text(text: string): Response;
	html(html: string): Response;
	status(code: number): Context;
}

export interface MiddlewareFunction {
	(c: Context, next?: () => Promise<void> | void):
		| Promise<Response | void>
		| Response
		| void;
}

export interface RouteHandler {
	(c: Context): Promise<Response | void> | Response | void;
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
	use(path: string, router: Router): void;
}

import { Router } from './core/router';
import http from 'http';
import { createServer } from './core/server';

import { IncomingMessage, ServerResponse } from 'http';

export type Middleware = (
	req: IncomingMessage,
	res: ServerResponse,
	next: () => void,
) => void;

export class Atomik extends Router {
	server: http.Server;
	customListen: boolean = false;

	constructor(data?: { port?: number; callback?: () => void }) {
		super();
		const port = data?.port;
		const callback = data?.callback;
		this.server = createServer(this);
		this.server.listen(
			port ? port : 3000,
			callback
				? callback
				: () => {
						console.log(
							`Server is running on http://localhost:${port ? port : 3000}`,
						);
				  },
		);
	}
}

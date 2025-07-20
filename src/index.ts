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

	constructor() {
		super();
		this.server = createServer(this);
		this.server.listen(5500, () => {
			console.log('Server is running on http://localhost:5500');
		});
	}
}

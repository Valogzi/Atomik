import { Router } from './core/router';
import http from 'http';
import { createServer } from './core/server';

export class Atomik extends Router {
	server: http.Server;

	constructor() {
		super();
		this.server = createServer(this);
		this.server.listen(3000, () => {
			console.log('Server is running on http://localhost:3000');
		});
	}
}

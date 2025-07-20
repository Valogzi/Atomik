import { Router } from './core/router';
import http from 'http';
import { createServer } from './core/server';

// Export des plugins
export * from './plugins';

// Export des types core
export { Context } from './core/context';
export { Router } from './core/router';

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

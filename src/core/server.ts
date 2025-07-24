import http from 'http';
import { Atomik } from '..';

export function createServer(router: Atomik) {
	return http.createServer(async (req, res) => {
		await router.handleMiddleware(req, res);
	});
}

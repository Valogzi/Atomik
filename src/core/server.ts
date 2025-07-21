import http from 'http';
import { Router } from './router';

export function createServer(router: Router) {
	return http.createServer(async (req, res) => {
		await router.handleMiddleware(req, res);
	});
}

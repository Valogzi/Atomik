import http from 'http';
import { Router } from './router';

export function createServer(router: Router) {
	return http.createServer((req, res) => {
		router.handleMiddleware(req, res);
	});
}

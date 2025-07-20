// src/core/response.ts
import { ServerResponse } from 'http';

export function createResponse(res: ServerResponse) {
	return {
		send: (body: string | object) => {
			if (typeof body === 'object') {
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(body));
			} else {
				if (body.startsWith('<')) {
					res.setHeader('Content-Type', 'text/html');
				} else {
					res.setHeader('Content-Type', 'text/plain');
				}
				res.end(body);
			}
		},
		status: (code: number) => {
			res.statusCode = code;
			return createResponse(res); // for chaining
		},
		raw: res,
	};
}
export type Response = ReturnType<typeof createResponse>;

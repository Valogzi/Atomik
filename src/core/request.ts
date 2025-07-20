// src/core/request.ts
import { IncomingMessage } from 'http';

export function createRequest(req: IncomingMessage) {
	return {
		method: req.method,
		url: req.url,
		headers: req.headers,
		raw: req,
	};
}
export type Request = ReturnType<typeof createRequest>;

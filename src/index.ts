import { IncomingMessage, ServerResponse } from 'http';
import { Router } from './core/router';

// Export des plugins
export * from './plugins';

// Export des types core
export { Context } from './core/context';
export { Router } from './core/router';

export class Atomik extends Router {
	constructor() {
		super();
	}

	async fetch(
		req: Request | IncomingMessage,
		_res?: ServerResponse<IncomingMessage>,
	): Promise<Response> {
		if (req instanceof IncomingMessage && _res) {
			// On utilise le handleMiddleware pour traiter la requête
			await this.handleMiddleware(req, _res);
			return new Response(null, {
				status: 200,
				headers: { 'Content-Type': 'text/plain' },
			});
		}
		let status = 200;
		let headers: Record<string, string> = {};
		let body: string | Uint8Array | null = null;

		const fakeRes = {
			statusCode: 200,
			setHeader: (key: string, value: string) => {
				headers[key] = value;
			},
			end: (data?: any) => {
				body = data ?? null;
			},
			writeHead: (code: number, hdrs: Record<string, string>) => {
				status = code;
				headers = { ...headers, ...hdrs };
			},
		};

		const res = await this.handleMiddleware(req as any, fakeRes as any);

		// Si handleMiddleware a retourné une vraie Response, utilise-la
		if (res instanceof Response) {
			return res;
		}

		// Sinon, on construit la réponse manuellement (Node fallback)
		return new Response(body, {
			status,
			headers,
		});
	}
}

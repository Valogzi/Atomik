import { edgeContext } from '../../types';

export const EdgeContext = (
	req: Request,
	res: Response,
	params: Record<string, string> = {},
): edgeContext => {
	const url = new URL(req.url);

	let headers = new Headers();
	let statusCode = 200;

	const ctx: edgeContext = {
		req,
		res,
		url: url.pathname,
		method: req.method || 'GET',
		params,
		query: url.searchParams,
		text(body: string): Response {
			headers.set('Content-Type', 'text/plain; charset=utf-8');
			return new Response(body, { status: statusCode, headers });
		},
		json(body: object): Response {
			headers.set('Content-Type', 'application/json; charset=utf-8');
			return new Response(JSON.stringify(body), {
				status: statusCode,
				headers,
			});
		},
		html(body: string): Response {
			headers.set('Content-Type', 'text/html; charset=utf-8');
			return new Response(body || '<!DOCTYPE html><html><body></body></html>', {
				status: statusCode,
				headers,
			});
		},
		set(header: string, value: string) {
			headers.set(header, value);
			return ctx;
		},
		send(body: string | object): Response {
			if (typeof body === 'object') {
				return ctx.json(body);
			}
			if (body.startsWith('<')) {
				return ctx.html(body);
			}
			return ctx.text(body);
		},
		status(code: number) {
			statusCode = code;
			return ctx;
		},
		redirect(url: string): Response {
			return new Response(null, {
				status: 302,
				headers: { Location: url },
			});
		},
	};

	return ctx;
};

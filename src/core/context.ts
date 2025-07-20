import { IncomingMessage, ServerResponse } from 'http';

export function createContext(req: IncomingMessage, res: ServerResponse) {
	const url = req.url
		? new URL(req.url, `http://${req.headers.host}`).pathname
		: null;
	const paramsParser = url?.split(':');

	return {
		req,
		res,
		params: paramsParser,
		query: new URLSearchParams(req.url?.split('?')[1] || ''),
		text: (body: string) => {
			res.setHeader('Content-Type', 'text/plain');
			return res.end(body);
		},
		json: (body: object) => {
			res.setHeader('Content-Type', 'application/json');
			return res.end(JSON.stringify(body));
		},
		html: (htmlElement: string) => {
			res.setHeader('Content-Type', 'text/html');
			return res.end(
				htmlElement || '<!DOCTYPE html><html><body></body></html>',
			);
		},
		status: (code: number) => {
			res.statusCode = code;
			return createContext(req, res);
		},
		redirect: (url: string) => {
			res.writeHead(302, {
				Location: url,
			});
			res.end();
		},
		url,
	};
}
export type Context = ReturnType<typeof createContext>;

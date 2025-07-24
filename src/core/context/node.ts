import { IncomingMessage, ServerResponse } from 'http';
import { Context } from '../../types';
import { nodeRequest } from '../api/request';

export const nodejsContext = (
	req: IncomingMessage,
	res: ServerResponse,
	params: Record<string, string> = {},
): Context => {
	const url = req.url
		? new URL(req.url, `http://${req.headers.host}`).pathname
		: null;

	const ctx = {
		req,
		res,
		url,
		method: req.method || 'GET',
		params, // Maintenant c'est un objet avec les paramètres de route
		body: nodeRequest(req),
		query: new URLSearchParams(req.url?.split('?')[1] || ''),
		text: (body: string) => {
			res.setHeader('Content-Type', 'text/plain; charset=utf-8');
			res.end(body);
			return;
		},
		json: (body: object) => {
			res.setHeader('Content-Type', 'application/json; charset=utf-8');
			res.end(JSON.stringify(body));
			return;
		},
		html: (htmlElement: string) => {
			res.setHeader('Content-Type', 'text/html; charset=utf-8');
			res.end(htmlElement || '<!DOCTYPE html><html><body></body></html>');
			return;
		},
		set: (header: string, value: string) => {
			res.setHeader(header, value);
			return ctx;
		},
		send: (body: string | object) => {
			if (typeof body === 'object') {
				res.setHeader('Content-Type', 'application/json; charset=utf-8');
				res.end(JSON.stringify(body));
				return;
			}
			if (body.startsWith('<')) {
				res.setHeader('Content-Type', 'text/html; charset=utf-8');
				res.end(body);
				return;
			}
			res.setHeader('Content-Type', 'text/plain; charset=utf-8');
			res.end(String(body));
			return;
		},
		status: (code: number) => {
			res.statusCode = code;
			return ctx;
		},
		redirect: (url: string) => {
			res.writeHead(302, {
				Location: url,
			});
			res.end();
		},
	};

	return ctx;
};

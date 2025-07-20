import { Context } from 'atomikjs';

export const logger = (c: Context, next: () => void) => {
	const start = Date.now();
	const method = c.req.method;
	const url = c.req.url;

	console.log(`📥 ${method} ${url}`);

	next();

	const duration = Date.now() - start;
	console.log(`📤 ${method} ${url} - ${duration}ms`);
};

import app from './basic'; // export default app
import { Request } from 'undici';

async function test() {
	const req = new Request('http://localhost/api/test', {
		method: 'GET',
		headers: {
			'User-Agent': 'EdgeClient',
		},
	});

	// 👇 Cast au type global Request DOM
	const res = await app.fetch(req as unknown as globalThis.Request);

	console.log('Status:', res.status);
	console.log('Headers:', Object.fromEntries(res.headers.entries()));
	console.log('Body:', await res.text());
}

test().catch(console.error);

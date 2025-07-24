import { IncomingMessage } from 'http';

async function parseBodyOnNode(req: IncomingMessage): Promise<any> {
	const contentType = req.headers['content-type'] || '';
	let body = '';

	for await (const chunk of req) {
		body += chunk;
	}

	let parsedBody: any = body;

	if (contentType.includes('application/json')) {
		parsedBody = JSON.parse(body);
	} else if (contentType.includes('application/x-www-form-urlencoded')) {
		const params = new URLSearchParams(body);
		parsedBody = Object.fromEntries(params.entries());
	}

	return parsedBody;
}

export async function nodeRequest(req: IncomingMessage): Promise<any> {
	if (req instanceof IncomingMessage) {
		const _body = await parseBodyOnNode(req);
		return _body;
	}
	throw new Error('Unsupported request type');
}

export async function parseBody(req: Request): Promise<any> {
	const contentType = req.headers.get('content-type');

	let body: any = null;
	if (contentType?.includes('application/json')) {
		body = await req.json();
	} else if (contentType?.includes('application/x-www-form-urlencoded')) {
		const formData = await req.formData();
		body = Object.fromEntries(formData.entries());
	} else {
		body = await req.text(); // fallback
	}

	return body;
}

import { createServer } from '../core/server';
import { serveOptions } from '../types';

export function serve({ app, port = 5656 }: serveOptions) {
	const server = createServer(app);
	server.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}`);
	});
}

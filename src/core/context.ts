import { IncomingMessage, ServerResponse } from 'http';
import { nodejsContext } from './context/node';
import { EdgeContext } from './context/edge';

export function createContext(
	req: IncomingMessage | Request,
	res: ServerResponse | Response,
	params: Record<string, string> = {},
) {
	if (req instanceof IncomingMessage && res instanceof ServerResponse) {
		return nodejsContext(req, res, params);
	} else {
		return EdgeContext(req as Request, res as Response, params);
	}
}
export type Context = ReturnType<typeof createContext>;

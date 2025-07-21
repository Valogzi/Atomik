import { IncomingMessage, ServerResponse } from 'http';
import { Context } from '../core/context';
import { edgeContext, Context as CTX } from '../types/index';

export interface CorsOptions {
	/**
	 * Origines autorisées
	 * @default "*"
	 */
	origin?: string | string[] | boolean | ((origin: string) => boolean);

	/**
	 * Méthodes HTTP autorisées
	 * @default ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]
	 */
	methods?: string[];

	/**
	 * Headers autorisés
	 * @default "*"
	 */
	allowedHeaders?: string | string[];

	/**
	 * Headers exposés
	 */
	exposedHeaders?: string[];

	/**
	 * Autoriser les credentials (cookies, auth headers)
	 * @default false
	 */
	credentials?: boolean;

	/**
	 * Durée de cache des preflight requests (en secondes)
	 * @default 86400 (24 heures)
	 */
	maxAge?: number;

	/**
	 * Gérer automatiquement les requêtes OPTIONS preflight
	 * @default true
	 */
	preflightContinue?: boolean;

	/**
	 * Status code pour les requêtes OPTIONS
	 * @default 204
	 */
	optionsSuccessStatus?: number;
}

const DEFAULT_OPTIONS: Required<CorsOptions> = {
	origin: '*',
	methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
	allowedHeaders: '*',
	exposedHeaders: [],
	credentials: false,
	maxAge: 86400,
	preflightContinue: false,
	optionsSuccessStatus: 204,
};

/**
 * Plugin CORS pour Atomik
 * @param options Configuration CORS
 * @returns Middleware CORS
 */
export function cors(options: CorsOptions = {}) {
	const config = { ...DEFAULT_OPTIONS, ...options };

	return async (c: Context, next: () => void) => {
		if (c.req instanceof IncomingMessage && c.res instanceof ServerResponse) {
			const origin = getOrigin(c.req.headers.origin || '', config.origin);

			// 1. GESTION DE L'ORIGIN
			if (origin) {
				c.res.setHeader('Access-Control-Allow-Origin', origin);
			}

			// 2. GESTION DES CREDENTIALS
			if (config.credentials) {
				c.res.setHeader('Access-Control-Allow-Credentials', 'true');
			}

			// 3. GESTION DES HEADERS EXPOSÉS
			if (config.exposedHeaders.length > 0) {
				c.res.setHeader(
					'Access-Control-Expose-Headers',
					config.exposedHeaders.join(', '),
				);
			}

			// 4. GESTION DES REQUÊTES PREFLIGHT (OPTIONS)
			if (c.req.method === 'OPTIONS') {
				// Headers autorisés
				if (config.allowedHeaders === '*') {
					const requestHeaders =
						c.req.headers['access-control-request-headers'];
					if (requestHeaders) {
						c.res.setHeader('Access-Control-Allow-Headers', requestHeaders);
					}
				} else if (Array.isArray(config.allowedHeaders)) {
					c.res.setHeader(
						'Access-Control-Allow-Headers',
						config.allowedHeaders.join(', '),
					);
				} else {
					c.res.setHeader(
						'Access-Control-Allow-Headers',
						config.allowedHeaders,
					);
				}

				// Méthodes autorisées
				c.res.setHeader(
					'Access-Control-Allow-Methods',
					config.methods.join(', '),
				);

				// Cache duration
				c.res.setHeader('Access-Control-Max-Age', config.maxAge.toString());

				// Répondre immédiatement à la requête preflight
				if (!config.preflightContinue) {
					c.res.statusCode = config.optionsSuccessStatus;
					c.res.end();
					return;
				}
			}

			// 5. CONTINUER VERS LE PROCHAIN MIDDLEWARE/HANDLER
			next();
		}

		if (c.req instanceof Request) {
			const origin = getOrigin(
				c.req.headers.get('origin') || '',
				config.origin,
			);

			const headers = new Headers();

			if (origin) headers.set('Access-Control-Allow-Origin', origin);
			if (config.credentials)
				headers.set('Access-Control-Allow-Credentials', 'true');
			if (config.exposedHeaders.length > 0)
				headers.set(
					'Access-Control-Expose-Headers',
					config.exposedHeaders.join(', '),
				);

			if (c.req.method === 'OPTIONS') {
				// Allow Headers
				if (config.allowedHeaders === '*') {
					const reqHeaders = c.req.headers.get(
						'access-control-request-headers',
					);
					if (reqHeaders)
						headers.set('Access-Control-Allow-Headers', reqHeaders);
				} else if (Array.isArray(config.allowedHeaders)) {
					headers.set(
						'Access-Control-Allow-Headers',
						config.allowedHeaders.join(', '),
					);
				} else {
					headers.set('Access-Control-Allow-Headers', config.allowedHeaders);
				}

				// Allow Methods
				headers.set('Access-Control-Allow-Methods', config.methods.join(', '));
				headers.set('Access-Control-Max-Age', config.maxAge.toString());

				if (!config.preflightContinue) {
					return new Response(null, {
						status: config.optionsSuccessStatus,
						headers,
					});
				}
			}

			// On injecte les headers pour continuer
			c.res = new Response(null, { headers }); // ou merge les headers plus proprement si nécessaire
			next();
		}
	};
}

/**
 * Détermine l'origin à autoriser
 */
function getOrigin(
	requestOrigin: string,
	configOrigin: CorsOptions['origin'],
): string | null {
	// Pas d'origin dans la requête
	if (!requestOrigin) {
		return typeof configOrigin === 'string' ? configOrigin : null;
	}

	// Origine = "*" (tous autorisés)
	if (configOrigin === '*' || configOrigin === true) {
		return '*';
	}

	// Origine = false (aucun autorisé)
	if (configOrigin === false) {
		return null;
	}

	// Origine = string spécifique
	if (typeof configOrigin === 'string') {
		return configOrigin === requestOrigin ? requestOrigin : null;
	}

	// Origine = array de strings
	if (Array.isArray(configOrigin)) {
		return configOrigin.includes(requestOrigin) ? requestOrigin : null;
	}

	// Origine = fonction custom
	if (typeof configOrigin === 'function') {
		return configOrigin(requestOrigin) ? requestOrigin : null;
	}

	return null;
}

/**
 * Configuration CORS permissive (développement)
 */
export const corsPermissive = () =>
	cors({
		origin: true,
		credentials: true,
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
		allowedHeaders: '*',
	});

/**
 * Configuration CORS stricte (production)
 */
export const corsStrict = (allowedOrigins: string[]) =>
	cors({
		origin: allowedOrigins,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		maxAge: 3600, // 1 heure
	});

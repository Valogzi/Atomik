"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsStrict = exports.corsPermissive = void 0;
exports.cors = cors;
const DEFAULT_OPTIONS = {
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
function cors(options = {}) {
    const config = { ...DEFAULT_OPTIONS, ...options };
    return (c, next) => {
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
            c.res.setHeader('Access-Control-Expose-Headers', config.exposedHeaders.join(', '));
        }
        // 4. GESTION DES REQUÊTES PREFLIGHT (OPTIONS)
        if (c.req.method === 'OPTIONS') {
            // Headers autorisés
            if (config.allowedHeaders === '*') {
                const requestHeaders = c.req.headers['access-control-request-headers'];
                if (requestHeaders) {
                    c.res.setHeader('Access-Control-Allow-Headers', requestHeaders);
                }
            }
            else if (Array.isArray(config.allowedHeaders)) {
                c.res.setHeader('Access-Control-Allow-Headers', config.allowedHeaders.join(', '));
            }
            else {
                c.res.setHeader('Access-Control-Allow-Headers', config.allowedHeaders);
            }
            // Méthodes autorisées
            c.res.setHeader('Access-Control-Allow-Methods', config.methods.join(', '));
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
    };
}
/**
 * Détermine l'origin à autoriser
 */
function getOrigin(requestOrigin, configOrigin) {
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
const corsPermissive = () => cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
});
exports.corsPermissive = corsPermissive;
/**
 * Configuration CORS stricte (production)
 */
const corsStrict = (allowedOrigins) => cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600, // 1 heure
});
exports.corsStrict = corsStrict;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = createContext;
function createContext(req, res, params = {}) {
    const url = req.url
        ? new URL(req.url, `http://${req.headers.host}`).pathname
        : null;
    return {
        req,
        res,
        method: req.method || 'GET',
        params, // Maintenant c'est un objet avec les paramètres de route
        query: new URLSearchParams(req.url?.split('?')[1] || ''),
        text: (body) => {
            res.setHeader('Content-Type', 'text/plain');
            return res.end(body);
        },
        json: (body) => {
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(body));
        },
        html: (htmlElement) => {
            res.setHeader('Content-Type', 'text/html');
            return res.end(htmlElement || '<!DOCTYPE html><html><body></body></html>');
        },
        status: (code) => {
            res.statusCode = code;
            return createContext(req, res, params);
        },
        redirect: (url) => {
            res.writeHead(302, {
                Location: url,
            });
            res.end();
        },
        url,
    };
}

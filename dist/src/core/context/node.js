"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodejsContext = void 0;
const request_1 = require("../api/request");
const nodejsContext = (req, res, params = {}) => {
    const url = req.url
        ? new URL(req.url, `http://${req.headers.host}`).pathname
        : null;
    const ctx = {
        req,
        res,
        url,
        method: req.method || 'GET',
        params, // Maintenant c'est un objet avec les paramètres de route
        body: (0, request_1.nodeRequest)(req),
        query: new URLSearchParams(req.url?.split('?')[1] || ''),
        text: (body) => {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end(body);
            return;
        },
        json: (body) => {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(body));
            return;
        },
        html: (htmlElement) => {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(htmlElement || '<!DOCTYPE html><html><body></body></html>');
            return;
        },
        set: (header, value) => {
            res.setHeader(header, value);
            return ctx;
        },
        send: (body) => {
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
        status: (code) => {
            res.statusCode = code;
            return ctx;
        },
        redirect: (url) => {
            res.writeHead(302, {
                Location: url,
            });
            res.end();
        },
    };
    return ctx;
};
exports.nodejsContext = nodejsContext;

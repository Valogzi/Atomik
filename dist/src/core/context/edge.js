"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdgeContext = void 0;
const EdgeContext = (req, res, params = {}) => {
    const url = new URL(req.url);
    let headers = new Headers();
    let statusCode = 200;
    const ctx = {
        req,
        res,
        url: url.pathname,
        method: req.method || 'GET',
        params,
        query: url.searchParams,
        text(body) {
            headers.set('Content-Type', 'text/plain; charset=utf-8');
            return new Response(body, { status: statusCode, headers });
        },
        json(body) {
            headers.set('Content-Type', 'application/json; charset=utf-8');
            return new Response(JSON.stringify(body), {
                status: statusCode,
                headers,
            });
        },
        html(body) {
            headers.set('Content-Type', 'text/html; charset=utf-8');
            return new Response(body || '<!DOCTYPE html><html><body></body></html>', {
                status: statusCode,
                headers,
            });
        },
        set(header, value) {
            headers.set(header, value);
            return ctx;
        },
        send(body) {
            if (typeof body === 'object') {
                return ctx.json(body);
            }
            if (body.startsWith('<')) {
                return ctx.html(body);
            }
            return ctx.text(body);
        },
        status(code) {
            statusCode = code;
            return ctx;
        },
        redirect(url) {
            return new Response(null, {
                status: 302,
                headers: { Location: url },
            });
        },
    };
    return ctx;
};
exports.EdgeContext = EdgeContext;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeRequest = nodeRequest;
exports.parseBody = parseBody;
const http_1 = require("http");
async function parseBodyOnNode(req) {
    const contentType = req.headers['content-type'] || '';
    let body = '';
    for await (const chunk of req) {
        body += chunk;
    }
    let parsedBody = body;
    if (contentType.includes('application/json')) {
        parsedBody = JSON.parse(body);
    }
    else if (contentType.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams(body);
        parsedBody = Object.fromEntries(params.entries());
    }
    return parsedBody;
}
async function nodeRequest(req) {
    if (req instanceof http_1.IncomingMessage) {
        const _body = await parseBodyOnNode(req);
        return _body;
    }
    throw new Error('Unsupported request type');
}
async function parseBody(req) {
    const contentType = req.headers.get('content-type');
    let body = null;
    if (contentType?.includes('application/json')) {
        body = await req.json();
    }
    else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await req.formData();
        body = Object.fromEntries(formData.entries());
    }
    else {
        body = await req.text(); // fallback
    }
    return body;
}

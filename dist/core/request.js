"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequest = createRequest;
function createRequest(req) {
    return {
        method: req.method,
        url: req.url,
        headers: req.headers,
        raw: req,
    };
}

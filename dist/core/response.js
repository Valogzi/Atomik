"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResponse = createResponse;
function createResponse(res) {
    return {
        send: (body) => {
            if (typeof body === 'object') {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(body));
            }
            else {
                if (body.startsWith('<')) {
                    res.setHeader('Content-Type', 'text/html');
                }
                else {
                    res.setHeader('Content-Type', 'text/plain');
                }
                res.end(body);
            }
        },
        status: (code) => {
            res.statusCode = code;
            return createResponse(res); // for chaining
        },
        raw: res,
    };
}

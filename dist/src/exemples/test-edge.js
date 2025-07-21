"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const basic_1 = __importDefault(require("./basic")); // export default app
const undici_1 = require("undici");
async function test() {
    const req = new undici_1.Request('http://localhost/api/test', {
        method: 'GET',
        headers: {
            'User-Agent': 'EdgeClient',
        },
    });
    // 👇 Cast au type global Request DOM
    const res = await basic_1.default.fetch(req);
    console.log('Status:', res.status);
    console.log('Headers:', Object.fromEntries(res.headers.entries()));
    console.log('Body:', await res.text());
}
test().catch(console.error);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Atomik = void 0;
const router_1 = require("./core/router");
const server_1 = require("./core/server");
class Atomik extends router_1.Router {
    constructor() {
        super();
        this.server = (0, server_1.createServer)(this);
        this.server.listen(3000, () => {
            console.log('Server is running on http://localhost:3000');
        });
    }
}
exports.Atomik = Atomik;

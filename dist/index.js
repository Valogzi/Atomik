"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Atomik = void 0;
const router_1 = require("./core/router");
const server_1 = require("./core/server");
class Atomik extends router_1.Router {
    constructor() {
        super();
        this.customListen = false;
        this.server = (0, server_1.createServer)(this);
        this.server.listen(5500, () => {
            console.log('Server is running on http://localhost:5500');
        });
    }
}
exports.Atomik = Atomik;

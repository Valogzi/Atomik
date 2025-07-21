"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = serve;
const server_1 = require("../core/server");
function serve({ app, port = 5656 }) {
    const server = (0, server_1.createServer)(app);
    server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = createContext;
const http_1 = require("http");
const node_1 = require("./context/node");
const edge_1 = require("./context/edge");
function createContext(req, res, params = {}) {
    if (req instanceof http_1.IncomingMessage && res instanceof http_1.ServerResponse) {
        return (0, node_1.nodejsContext)(req, res, params);
    }
    else {
        return (0, edge_1.EdgeContext)(req, res, params);
    }
}

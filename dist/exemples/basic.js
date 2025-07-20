"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const app = new index_1.Atomik();
app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to Atomik!',
        method: req.method,
        url: req.url,
        headers: req.headers,
    });
});

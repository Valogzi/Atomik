"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const app = new index_1.Atomik();
app.get('/', c => {
    c.status(200).text('Hello, World! dqddq');
});

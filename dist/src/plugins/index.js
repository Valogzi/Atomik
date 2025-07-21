"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = exports.corsStrict = exports.corsPermissive = exports.cors = void 0;
// Export des plugins Atomik
var cors_1 = require("./cors");
Object.defineProperty(exports, "cors", { enumerable: true, get: function () { return cors_1.cors; } });
Object.defineProperty(exports, "corsPermissive", { enumerable: true, get: function () { return cors_1.corsPermissive; } });
Object.defineProperty(exports, "corsStrict", { enumerable: true, get: function () { return cors_1.corsStrict; } });
var nodeServer_1 = require("./nodeServer");
Object.defineProperty(exports, "serve", { enumerable: true, get: function () { return nodeServer_1.serve; } });

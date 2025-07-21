"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const api = new index_1.Atomik();
api.use((0, index_1.cors)());
api.get('/', async (c) => {
    c.status(200).text('Hello, World! dqddq');
});
// Route avec paramètres
api.get('/post/:id', async (c) => {
    const id = c.params.id;
    return c.json({
        message: `Récupération du post avec l'ID: ${id}`,
        id: id,
    });
});
api.get('/test', c => {
    c.status(200).set('X-Custom', 'value').json({ foo: 'bar' });
});
// Route avec plusieurs paramètres
api.get('/user/:userId/post/:postId', c => {
    const { userId, postId } = c.params;
    return c.json({
        message: `Post ${postId} de l'utilisateur ${userId}`,
        userId,
        postId,
    });
});
// Route avec paramètre et query
api.get('/search/:category', c => {
    const category = c.params.category;
    const query = c.query.get('q');
    const limit = c.query.get('limit') || '10';
    return c.json({
        category,
        searchQuery: query,
        limit: parseInt(limit),
        results: [],
    });
});
const statusApi = new index_1.Atomik();
// fonction asynchrone pour simuler une opération longue
statusApi.get('/', c => {
    // Simule une opération longue
    new Promise(resolve => setTimeout(resolve, 1000));
    return c.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
    });
});
statusApi.get('/health', c => {
    return c.json({
        status: 'Healthy',
        timestamp: new Date().toISOString(),
    });
});
const app = new index_1.Atomik();
app.route('/api', api);
app.route('/status', statusApi);
(0, index_1.serve)({ app: app });
exports.default = app;

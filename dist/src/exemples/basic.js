"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const api = new index_1.Atomik();
// api.use(cors());
api.get('/', c => {
    return c.status(200).text('Hello, World! dqddq');
});
api.get('/qdqq', c => {
    return c.json({
        message: 'Hello, World! from /qdqq',
    });
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
    return c.status(200).set('X-Custom', 'value').json({ foo: 'bar' });
});
api.get('/user/:userId/post/:postId', c => {
    const { userId, postId } = c.params;
    return c.json({
        message: `Post ${postId} de l'utilisateur ${userId}`,
        userId,
        postId,
    });
});
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
api.post('/submit', async (c) => {
    const body = await c.body;
    return c.json({
        message: 'Données soumises avec succès',
        data: body,
    });
});
const statusApi = new index_1.Atomik();
statusApi.get('/status-test', c => {
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
app.use('*', (c, next) => {
    console.log(`[API ROUTER] ${c.method} ${c.url}`);
    next();
});
app.route('/', api);
app.route('/', statusApi);
(0, index_1.serve)({ app: app });
exports.default = app;

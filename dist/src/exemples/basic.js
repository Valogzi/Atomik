"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const cors_1 = require("../plugins/cors");
const app = new index_1.Atomik({
    port: 3000,
    callback: () => {
        console.log('🚀 Server running on http://localhost:3000');
    },
});
app.use((c, next) => {
    if (c.url?.startsWith('/post')) {
        console.warn('unauthorized access to /post route');
        c.redirect('/'); // Redirection vers la page d'accueil
        return;
    }
    next();
});
app.use((0, cors_1.cors)());
app.get('/', c => {
    c.status(200).text('Hello, World! dqddq');
});
// Route avec paramètres
app.get('/post/:id', c => {
    const id = c.params.id;
    return c.json({
        message: `Récupération du post avec l'ID: ${id}`,
        id: id,
    });
});
// Route avec plusieurs paramètres
app.get('/user/:userId/post/:postId', c => {
    const { userId, postId } = c.params;
    return c.json({
        message: `Post ${postId} de l'utilisateur ${userId}`,
        userId,
        postId,
    });
});
// Route avec paramètre et query
app.get('/search/:category', c => {
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

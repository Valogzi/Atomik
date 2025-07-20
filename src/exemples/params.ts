import { Atomik } from '../index';

const app = new Atomik();

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

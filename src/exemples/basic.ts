import { Atomik, serve, cors } from '../index';
const api = new Atomik();

api.use(cors());

api.get('/', async c => {
	c.status(200).text('Hello, World! dqddq');
});

// Route avec paramètres
api.get('/post/:id', async c => {
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

const statusApi = new Atomik();

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

const app = new Atomik();
app.route('/api', api);
app.route('/status', statusApi);

serve({ app: app });

export default app;

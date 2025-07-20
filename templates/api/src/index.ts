import { Atomik, cors } from 'atomikjs';
import { usersRouter } from './routes/users';

const app = new Atomik({ port: 3000 });

// Middleware
app.use(cors());

// Routes
app.use('/api/users', usersRouter);

app.get('/', c => {
	return c.json({
		message: 'Welcome to Atomik API!',
		version: '1.0.0',
		endpoints: ['/api/users'],
	});
});

console.log('🚀 API Server running on http://localhost:3000');

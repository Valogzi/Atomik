import { Atomik, cors } from 'atomikjs';
import { apiRouter } from './routes/api';
import { staticRouter } from './routes/static';
import { logger } from './middleware/logger';

const app = new Atomik({ port: 3000 });

// Global middleware
app.use(logger);
app.use(cors());

// Routes
app.use('/api', apiRouter);
app.use('/', staticRouter);

app.get('/health', c => {
	return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

console.log('🚀 Full-stack server running on http://localhost:3000');

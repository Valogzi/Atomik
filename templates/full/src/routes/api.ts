import { Router } from 'atomikjs';

const router = new Router();

router.get('/status', c => {
	return c.json({
		status: 'active',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	});
});

router.get('/info', c => {
	return c.json({
		name: 'Atomik API',
		version: '1.0.0',
		framework: 'Atomik',
	});
});

export const apiRouter = router;

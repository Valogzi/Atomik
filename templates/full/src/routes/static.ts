import { Router } from 'atomikjs';

const router = new Router();

router.get('/', c => {
	return c.html(`
<!DOCTYPE html>
<html>
<head>
	<title>Atomik App</title>
	<style>
		body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
		.header { text-align: center; color: #2563eb; }
		.card { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
	</style>
</head>
<body>
	<h1 class="header">⚛️ Welcome to Atomik</h1>
	<div class="card">
		<h2>Ultra-fast Web Framework</h2>
		<p>Your full-stack Atomik application is running!</p>
		<ul>
			<li><a href="/api/status">API Status</a></li>
			<li><a href="/api/info">API Info</a></li>
			<li><a href="/health">Health Check</a></li>
		</ul>
	</div>
</body>
</html>
	`);
});

export const staticRouter = router;

import { Atomik } from 'atomikjs';

const app = new Atomik({
	port: 3000,
	callback: () => {
		console.log('🚀 Server running on http://localhost:3000');
	},
});

app.get('/', c => {
	return c.text('Hello, Atomik! 🚀');
});

app.get('/json', c => {
	return c.json({ message: 'Hello from Atomik API!' });
});

app.get('/html', c => {
	return c.html('<h1>Welcome to Atomik</h1><p>Ultra-fast web framework</p>');
});

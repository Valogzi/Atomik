import { Atomik } from 'atomik';

const app = new Atomik({ port: 3000 });

app.get('/', c => {
	return c.text('Hello, Atomik! 🚀');
});

app.get('/json', c => {
	return c.json({ message: 'Hello from Atomik API!' });
});

app.get('/html', c => {
	return c.html('<h1>Welcome to Atomik</h1><p>Ultra-fast web framework</p>');
});

console.log('🚀 Server running on http://localhost:3000');

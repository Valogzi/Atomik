import { Atomik } from '../index';
const app = new Atomik();

app.get('/', (req, res) => {
	res.send({
		message: 'Welcome to Atomik!',
		method: req.method,
		url: req.url,
		headers: req.headers,
	});
});

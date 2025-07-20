import { Atomik } from '../index';
const app = new Atomik();

app.get('/', c => {
	c.status(200).text('Hello, World! dqddq');
});

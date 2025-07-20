import { Atomik } from '../index';
const app = new Atomik({ port: 3838 });

app.get('/', c => {
	c.status(200).text('Hello, World! dqddq');
});

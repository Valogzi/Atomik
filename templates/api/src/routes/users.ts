import { Router } from 'atomikjs';

const router = new Router();

// Sample users data
const users = [
	{ id: 1, name: 'John Doe', email: 'john@example.com' },
	{ id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

router.get('/', c => {
	return c.json(users);
});

router.get('/:id', c => {
	const id = parseInt(c.params.id);
	const user = users.find(u => u.id === id);

	if (!user) {
		return c.status(404).json({ error: 'User not found' });
	}

	return c.json(user);
});

router.post('/', c => {
	// In a real app, you'd parse the request body
	const newUser = {
		id: users.length + 1,
		name: 'New User',
		email: 'new@example.com',
	};
	users.push(newUser);

	return c.status(201).json(newUser);
});

export const usersRouter = router;

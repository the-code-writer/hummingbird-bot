import express, { Router } from 'express'

const router: Router = express.Router()

// Mock user data - in a real app, you'd fetch this from a database
const users = [
	{ id: 1, name: 'Alice' },
	{ id: 2, name: 'Bob ' }
];
  
// GET all users
router.get('/', (req, res) => {
	res.json(users);
});
  
// GET user by ID
router.get('/:id', (req, res) => {
	const userId = parseInt(req.params.id);
	const user = users.find(u => u.id === userId);
	if (user) {
		res.status(200).json({ status: 'success', code: 200, message: 'User found', data: user });
	} else {
		res.status(404).json({ status: 'error', code: 404, message: 'User not found' });
	}
});
  
// POST new user
router.post('/', (req, res) => {
	const newUser = {
		id: users.length + 1,
		name: req.body.name
	};
	users.push(newUser);
	res.status(201).json(newUser);
});
  
export default router;
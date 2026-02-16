const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const users = req.app.locals.mockData.users;
    res.json(users);
});

router.get('/:id', (req, res) => {
    const user = req.app.locals.mockData.users.find(u => u._id === req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
});

router.post('/', (req, res) => {
    const newUser = {
        _id: Date.now().toString(),
        ...req.body,
        createdAt: new Date()
    };
    req.app.locals.mockData.users.push(newUser);
    res.json(newUser);
});

router.put('/:id', (req, res) => {
    const index = req.app.locals.mockData.users.findIndex(u => u._id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    req.app.locals.mockData.users[index] = {
        ...req.app.locals.mockData.users[index],
        ...req.body
    };
    res.json(req.app.locals.mockData.users[index]);
});

router.delete('/:id', (req, res) => {
    req.app.locals.mockData.users = req.app.locals.mockData.users.filter(u => u._id !== req.params.id);
    res.json({ message: 'User deleted' });
});

module.exports = router;
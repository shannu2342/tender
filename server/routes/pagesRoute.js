const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const pages = req.app.locals.mockData.pages;
    res.json(pages);
});

router.get('/:id', (req, res) => {
    const page = req.app.locals.mockData.pages.find(p => p._id === req.params.id);
    if (!page) {
        return res.status(404).json({ message: 'Page not found' });
    }
    res.json(page);
});

router.post('/', (req, res) => {
    const newPage = {
        _id: Date.now().toString(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    req.app.locals.mockData.pages.push(newPage);
    res.json(newPage);
});

router.put('/:id', (req, res) => {
    const index = req.app.locals.mockData.pages.findIndex(p => p._id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Page not found' });
    }
    req.app.locals.mockData.pages[index] = {
        ...req.app.locals.mockData.pages[index],
        ...req.body,
        updatedAt: new Date()
    };
    res.json(req.app.locals.mockData.pages[index]);
});

router.delete('/:id', (req, res) => {
    req.app.locals.mockData.pages = req.app.locals.mockData.pages.filter(p => p._id !== req.params.id);
    res.json({ message: 'Page deleted' });
});

module.exports = router;
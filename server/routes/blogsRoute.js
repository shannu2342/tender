const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const blogs = req.app.locals.mockData.blogs;
    res.json(blogs);
});

router.get('/:id', (req, res) => {
    const blog = req.app.locals.mockData.blogs.find(b => b._id === req.params.id);
    if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
});

router.post('/', (req, res) => {
    const newBlog = {
        _id: Date.now().toString(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    req.app.locals.mockData.blogs.push(newBlog);
    res.json(newBlog);
});

router.put('/:id', (req, res) => {
    const index = req.app.locals.mockData.blogs.findIndex(b => b._id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Blog not found' });
    }
    req.app.locals.mockData.blogs[index] = {
        ...req.app.locals.mockData.blogs[index],
        ...req.body,
        updatedAt: new Date()
    };
    res.json(req.app.locals.mockData.blogs[index]);
});

router.delete('/:id', (req, res) => {
    req.app.locals.mockData.blogs = req.app.locals.mockData.blogs.filter(b => b._id !== req.params.id);
    res.json({ message: 'Blog deleted' });
});

module.exports = router;
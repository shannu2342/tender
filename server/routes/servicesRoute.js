const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const services = req.app.locals.mockData.services;
    res.json(services);
});

router.get('/:id', (req, res) => {
    const service = req.app.locals.mockData.services.find(s => s._id === req.params.id);
    if (!service) {
        return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
});

router.post('/', (req, res) => {
    const newService = {
        _id: Date.now().toString(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    req.app.locals.mockData.services.push(newService);
    res.json(newService);
});

router.put('/:id', (req, res) => {
    const index = req.app.locals.mockData.services.findIndex(s => s._id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Service not found' });
    }
    req.app.locals.mockData.services[index] = {
        ...req.app.locals.mockData.services[index],
        ...req.body,
        updatedAt: new Date()
    };
    res.json(req.app.locals.mockData.services[index]);
});

router.delete('/:id', (req, res) => {
    req.app.locals.mockData.services = req.app.locals.mockData.services.filter(s => s._id !== req.params.id);
    res.json({ message: 'Service deleted' });
});

module.exports = router;
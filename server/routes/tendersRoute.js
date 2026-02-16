const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const includeDisabled = String(req.query.includeDisabled || '') === 'true';
    const tenders = req.app.locals.mockData.tenders
        .filter((item) => (includeDisabled ? true : item.enabled !== false))
        .sort((a, b) => new Date(a.lastDate || 0) - new Date(b.lastDate || 0));
    res.json(tenders);
});

router.get('/:id', (req, res) => {
    const tender = req.app.locals.mockData.tenders.find(t => t._id === req.params.id);
    if (!tender) {
        return res.status(404).json({ message: 'Tender not found' });
    }
    res.json(tender);
});

router.post('/', (req, res) => {
    const newTender = {
        _id: Date.now().toString(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    req.app.locals.mockData.tenders.push(newTender);
    res.json(newTender);
});

router.put('/:id', (req, res) => {
    const index = req.app.locals.mockData.tenders.findIndex(t => t._id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Tender not found' });
    }
    req.app.locals.mockData.tenders[index] = {
        ...req.app.locals.mockData.tenders[index],
        ...req.body,
        updatedAt: new Date()
    };
    res.json(req.app.locals.mockData.tenders[index]);
});

router.delete('/:id', (req, res) => {
    req.app.locals.mockData.tenders = req.app.locals.mockData.tenders.filter(t => t._id !== req.params.id);
    res.json({ message: 'Tender deleted' });
});

module.exports = router;

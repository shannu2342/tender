const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const enquiries = req.app.locals.mockData.enquiries;
    res.json(enquiries);
});

router.get('/:id', (req, res) => {
    const enquiry = req.app.locals.mockData.enquiries.find(e => e._id === req.params.id);
    if (!enquiry) {
        return res.status(404).json({ message: 'Enquiry not found' });
    }
    res.json(enquiry);
});

router.post('/', (req, res) => {
    const newEnquiry = {
        _id: Date.now().toString(),
        ...req.body,
        createdAt: new Date()
    };
    req.app.locals.mockData.enquiries.push(newEnquiry);
    res.json(newEnquiry);
});

router.put('/:id', (req, res) => {
    const index = req.app.locals.mockData.enquiries.findIndex(e => e._id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Enquiry not found' });
    }
    req.app.locals.mockData.enquiries[index] = {
        ...req.app.locals.mockData.enquiries[index],
        ...req.body
    };
    res.json(req.app.locals.mockData.enquiries[index]);
});

router.delete('/:id', (req, res) => {
    req.app.locals.mockData.enquiries = req.app.locals.mockData.enquiries.filter(e => e._id !== req.params.id);
    res.json({ message: 'Enquiry deleted' });
});

module.exports = router;
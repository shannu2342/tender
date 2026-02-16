const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const settings = req.app.locals.mockData.settings;
    res.json(settings);
});

router.put('/', (req, res) => {
    req.app.locals.mockData.settings = {
        ...req.app.locals.mockData.settings,
        ...req.body
    };
    res.json(req.app.locals.mockData.settings);
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

router.get('/', async (req, res) => {
    const vendors = await Vendor.find();
    res.json(vendors);
});

router.post('/', async (req, res) => {
    try {
        const vendor = await Vendor.create(req.body);
        res.status(201).json(vendor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;

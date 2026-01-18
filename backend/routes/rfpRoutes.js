const express = require('express');
const router = express.Router();
const RFP = require('../models/RFP');
const Vendor = require('../models/Vendor');
const Proposal = require('../models/Proposal');
const aiService = require('../services/aiService');
const emailService = require('../services/emailService');

router.post('/generate', async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    const structuredData = await aiService.generateRfpStructure(query);
    if (!structuredData) return res.status(500).json({ error: 'AI generation failed' });

    res.json(structuredData);
});

router.post('/check-emails', async (req, res) => {
    try {
        const count = await emailService.checkEmails();
        res.json({ message: `Emails checked. Found ${count} new replies.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const rfp = await RFP.create(req.body);
        res.status(201).json(rfp);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    const rfps = await RFP.find().sort({ createdAt: -1 });
    res.json(rfps);
});

router.get('/:id', async (req, res) => {
    try {
        const rfp = await RFP.findById(req.params.id);
        const proposals = await Proposal.find({ rfpId: req.params.id }).populate('vendorId');
        res.json({ rfp, proposals });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:id/send', async (req, res) => {
    const { vendorIds } = req.body; 
    try {
        const rfp = await RFP.findById(req.params.id);
        const vendors = await Vendor.find({ '_id': { $in: vendorIds } });

        for (const vendor of vendors) {
            await emailService.sendRFP(vendor.email, rfp);
        }

        rfp.status = 'Sent';
        await rfp.save();

        res.json({ message: 'RFPs sent successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/compare', async (req, res) => {
    try {
        const proposals = await Proposal.find({ rfpId: req.params.id }).populate('vendorId');
        const comparison = await aiService.compareProposals(proposals);
        res.json(comparison);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

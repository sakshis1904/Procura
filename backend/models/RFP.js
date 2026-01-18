const mongoose = require('mongoose');

const rfpSchema = new mongoose.Schema({
    title: { type: String, required: true },
    originalQuery: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Draft', 'Sent', 'Closed'], default: 'Draft' },
    structuredData: {
        items: [{
            name: String,
            quantity: String,
            description: String
        }],
        budget: String,
        timeline: String,
        warranty: String,
        paymentTerms: String,
        summary: String
    }
});

module.exports = mongoose.model('RFP', rfpSchema);

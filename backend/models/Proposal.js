const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    rfpId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFP', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    receivedAt: { type: Date, default: Date.now },
    rawContent: String,
    parsedData: {
        pricing: String,
        deliveryTime: String,
        warranty: String,
        paymentTerms: String
    },
    aiSummary: String,
    aiRating: Number
});

module.exports = mongoose.model('Proposal', proposalSchema);

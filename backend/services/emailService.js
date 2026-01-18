const nodemailer = require('nodemailer');
const imaps = require('node-imap');
const Proposal = require('../models/Proposal');
const Vendor = require('../models/Vendor');
const RFP = require('../models/RFP');
const aiService = require('./aiService');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendRFP = async (vendorEmail, rfp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: vendorEmail,
        subject: `RFP Requirement: ${rfp.title} (ID: ${rfp._id})`,
        text: `Dear Vendor,

We have a new procurement requirement. Please verify the details below and reply to this email with your proposal.

Items:
${rfp.structuredData.items.map(i => `- ${i.name}: ${i.quantity}`).join('\n')}

Budget: ${rfp.structuredData.budget}
Timeline: ${rfp.structuredData.timeline}

IMPORTANT: Please reply to this email. Your subject line MUST contain "Re: RFP Requirement".

Regards,
Procurement Team`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

exports.checkEmails = async () => {
    const config = {
        imap: {
            user: process.env.EMAIL_USER,
            password: process.env.EMAIL_PASS,
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            authTimeout: 3000
        }
    };

    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');
        const searchCriteria = ['UNSEEN', ['SUBJECT', 'Re: RFP Requirement']];
        const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };

        const messages = await connection.search(searchCriteria, fetchOptions);

        for (const message of messages) {
            const subject = message.parts.find(p => p.which === 'HEADER').body.subject[0];
            const text = message.parts.find(p => p.which === 'TEXT').body;

            const rfpIdMatch = subject.match(/\(ID: (.*?)\)/);
            if (!rfpIdMatch) continue;
            const rfpId = rfpIdMatch[1];

            const from = message.parts.find(p => p.which === 'HEADER').body.from[0];
            const items = from.match(/<([^>]+)>/);
            const email = items ? items[1] : from;

            let vendor = await Vendor.findOne({ email });
            if (!vendor) {
                vendor = await Vendor.create({ name: from.split('<')[0].trim(), email });
            }

            const parsedData = await aiService.parseProposal(text);
            if (parsedData) {
                await Proposal.create({
                    rfpId,
                    vendorId: vendor._id,
                    rawContent: text,
                    parsedData,
                    aiSummary: parsedData.summary
                });
            }
        }

        connection.end();
        return messages.length;
    } catch (error) {
        console.error('IMAP Error:', error);
        return 0;
    }
};

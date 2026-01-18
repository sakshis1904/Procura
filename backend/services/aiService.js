const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function safeJsonParse(aiText) {
  const cleaned = aiText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  return JSON.parse(cleaned);
}

function extractBudget(text) {
  const match = text.match(/\$[\d,]+(\s*(per|each))?/i);
  return match ? match[0] : "Not specified";
}

function extractTimeline(text) {
  const match = text.match(
    /(next\s+(week|month|quarter|year)|within\s+\d+\s+(days|weeks|months))/i
  );
  return match ? match[0] : "Not specified";
}

exports.generateRfpStructure = async (inputText) => {
  const prompt = `
You are a procurement data extraction AI.

STRICT RULES:
- You MUST extract budget and timeline if mentioned.
- NEVER leave fields empty.
- If missing, write "Not specified".
- Return ONLY valid JSON. No markdown. No explanation.

User Requirement:
"${inputText}"

JSON format:
{
  "items": [
    { "name": "string", "quantity": "string", "description": "string" }
  ],
  "budget": "string",
  "timeline": "string",
  "warranty": "string",
  "paymentTerms": "string",
  "summary": "string"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

    console.log("Gemini RFP Raw Output:", aiText);

    const data = safeJsonParse(aiText);

    data.budget =
      data.budget && data.budget !== "Not specified"
        ? data.budget
        : extractBudget(inputText);

    data.timeline =
      data.timeline && data.timeline !== "Not specified"
        ? data.timeline
        : extractTimeline(inputText);

    return data;
  } catch (error) {
    console.error("AI RFP Generation Error:", error);

    return {
      items: [
        {
          name: "Laptop",
          quantity: "50",
          description: "Business laptops as per user requirement"
        }
      ],
      budget: extractBudget(inputText),
      timeline: extractTimeline(inputText),
      warranty: "Standard warranty",
      paymentTerms: "To be discussed",
      summary: inputText
    };
  }
};

exports.parseProposal = async (emailText) => {
  const prompt = `
Extract proposal details from this vendor email.
Return ONLY valid JSON.

Email:
"${emailText}"

JSON format:
{
  "pricing": "string",
  "deliveryTime": "string",
  "warranty": "string",
  "paymentTerms": "string",
  "summary": "string"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

    console.log("Gemini Proposal Raw Output:", aiText);

    return safeJsonParse(aiText);
  } catch (error) {
    console.error("AI Proposal Parse Error:", error);

    return {
      pricing: "Not specified",
      deliveryTime: "Not specified",
      warranty: "Not specified",
      paymentTerms: "Not specified",
      summary: "Unable to parse proposal automatically"
    };
  }
};

exports.compareProposals = async (proposals) => {
  const prompt = `
Compare these vendor proposals and recommend the best one.
Return ONLY JSON.

Proposals:
${JSON.stringify(proposals)}

JSON format:
{
  "summary": "string",
  "recommendation": "string",
  "rankings": [
    { "vendor": "string", "rank": number, "reason": "string" }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

    console.log("Gemini Comparison Raw Output:", aiText);

    return safeJsonParse(aiText);
  } catch (error) {
    console.error("AI Comparison Error:", error);

    return {
      summary: "Comparison could not be generated",
      recommendation: "Manual review required",
      rankings: []
    };
  }
};

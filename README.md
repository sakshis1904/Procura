# Procura - AI-Powered RFP Management System

Procura is an intelligent platform designed to streamline the Request for Proposal (RFP) process. It leverages AI to generate structured requirements from natural language, automates vendor outreach via email, and uses AI to parse and compare vendor proposals.

## Key Features

- **AI Requirement Generation**: Transform natural language descriptions into structured RFP items using Google Gemini AI.
- **Automated Vendor Outreach**: Send RFPs to vendors directly from the platform via email.
- **AI Proposal Parsing**: Automatically extract pricing, timelines, and terms from vendor email replies.
- **Intelligent Comparison**: Get AI-driven recommendations and rankings for vendor proposals.
- **Dashboard**: Track the status of all RFPs and proposals in one place.

## Screenshots

<img width="1600" height="835" alt="image" src="https://github.com/user-attachments/assets/a40c3c95-6e47-4c7c-805b-a3ea32f5d62d" />


<img width="1600" height="819" alt="image" src="https://github.com/user-attachments/assets/f358d557-f291-47cb-a864-eebe65b815e0" />


<img width="1600" height="827" alt="image" src="https://github.com/user-attachments/assets/fe8c85ca-78eb-4dcf-b838-8aeadaaa425f" />


## Tech Stack

### Frontend
- **React 19**
- **Tailwind CSS**
- **Vite**
- **Lucide React** (Icons)
- **React Router**

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose**
- **Google Generative AI (Gemini 1.5 Flash)**
- **Nodemailer** (Email Sending)
- **Node-IMAP** (Email Receiving)

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Google Gemini API Key
- Gmail account with App Password (for email features)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```


# AI Chatbot Web App

This project is a full-stack AI chatbot web application using OpenAI's API.

## Structure
- `ai-chatbot-backend`: Node.js Express backend (API proxy)
- `ai-chatbot-frontend`: React + Tailwind CSS frontend

## Quick Start

### Backend
1. `cd ai-chatbot-backend`
2. `npm install`
3. Create a `.env` file with your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. `npm start`

### Frontend
1. `cd ai-chatbot-frontend`
2. `npm install`
3. `npm start`

The frontend will run on http://localhost:3000 and the backend on http://localhost:5000. 
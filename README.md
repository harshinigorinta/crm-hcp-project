# AI-First CRM HCP Interaction Management System

## Overview

This project is an AI-powered CRM module designed to streamline how pharmaceutical sales representatives capture, manage, and analyze interactions with Healthcare Professionals (HCPs).

The system supports both structured data entry and conversational AI input, enabling users to log interactions efficiently while leveraging AI to extract, summarize, and enhance information.

---

## Key Features

* Dual input modes: structured form and conversational chat interface
* Automatic extraction of HCP details, product discussions, sentiment, and follow-up actions
* AI-powered tools built using LangGraph for modular interaction handling
* Centralized dashboard to view and manage all interactions
* Automated sentiment analysis for interaction insights
* Real-time AI processing using Groq LLM

---

## Tech Stack

| Layer            | Technology                         |
| ---------------- | ---------------------------------- |
| Frontend         | React, Redux Toolkit, React Router |
| Backend          | Python, FastAPI                    |
| AI Orchestration | LangGraph                          |
| LLM Provider     | Groq API                           |
| AI Model         | gemma2-9b-it                       |
| Database         | SQLite (SQLAlchemy)                |
| Styling          | Custom CSS, Google Inter           |

---

## AI Tools

The system implements five core AI tools using a LangGraph-based architecture:

1. Log Interaction – Extracts structured data from natural language input
2. Edit Interaction – Updates existing records using conversational instructions
3. Summarize Interaction – Generates concise summaries of interaction notes
4. Get HCP Profile – Provides professional insights and engagement strategies
5. Schedule Follow-up – Recommends follow-up actions with priority

---

## Project Structure

```bash
crm-hcp-project/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── agent.py
│   ├── routes.py
│   └── .env
│
├── frontend/
│   └── src/
│       ├── pages/
│       ├── store/
│       ├── App.js
│       └── index.js
│
└── README.md
```

---

## Setup Instructions

### Backend

```bash
cd backend
pip install fastapi uvicorn langgraph langchain-groq sqlalchemy python-dotenv pydantic
```

Create a `.env` file:

```bash
GROQ_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///./crm.db
```

Run the backend:

```bash
python -m uvicorn main:app --reload
```

Backend will be available at:
http://127.0.0.1:8000

API documentation:
http://127.0.0.1:8000/docs

---

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend will be available at:
http://localhost:3000

---

## API Endpoints

| Method | Endpoint                   | Description                   |
| ------ | -------------------------- | ----------------------------- |
| POST   | /api/log-chat              | Log interaction via AI        |
| POST   | /api/log-form              | Log interaction via form      |
| PUT    | /api/edit-interaction/{id} | Edit interaction              |
| POST   | /api/hcp-info              | Get HCP profile               |
| POST   | /api/schedule-followup     | Generate follow-up plan       |
| GET    | /api/interactions          | Retrieve all interactions     |
| GET    | /api/interactions/{id}     | Retrieve a single interaction |

---

## How It Works

User input (form or chat) is processed by a LangGraph-based agent.
The agent routes the request to the appropriate AI tool, which uses the Groq LLM to generate structured outputs.
The processed data is stored in the database and displayed through the frontend interface.

---

## Author

Harshini Gorinta
B.Tech Computer Science

---

## Notes

* SQLite is used for simplicity and requires no external setup
* A valid Groq API key is required for AI features
* Backend must be running before starting the frontend

---

## Submission Checklist

* Working frontend and backend
* All five AI tools implemented
* GitHub repository with complete code
* Demo video (10–15 minutes)

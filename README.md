# Diploma Project: Language Learning Platform with Chatbot

This project is an educational platform that enables language learners to practice through conversations with AI chatbots.

## Features

- User authentication (JWT)
- AI-powered chatbot conversations
- XP and level-based gamification
- Multiple chat sessions per user
- GPT-generated session titles
- Admin panel

## Tech Stack

- **Backend**: FastAPI, PostgreSQL, SQLAlchemy
- **Frontend**: React + MUI + Tailwind
- **AI**: OpenAI GPT integration

## Getting Started

### Backend

```bash
cd backend
uvicorn app.main:app --reload

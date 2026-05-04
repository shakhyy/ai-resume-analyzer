# AI Resume Analyzer

A production-ready full-stack web app for uploading resumes, parsing key sections, scoring ATS readiness, matching against a job role, suggesting improvements, and optimizing content for better job selection chances.

## Folder Structure

```txt
ai-resume-analyzer/
  backend/
    server.js
    controllers/
    middleware/
    models/
    routes/
    utils/resumeParser.js
    uploads/
    package.json
    .env.example
  frontend/
    app/
    components/
    lib/
    package.json
    .env.example
    tailwind.config.ts
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

3. Update `backend/.env` with your MongoDB connection string, JWT secret, and optional OpenAI API key.

4. Run the app:

```bash
npm run dev
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:5000`

## Environment Variables

Backend:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_resume_analyzer
JWT_SECRET=replace_with_a_long_random_secret
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
CLIENT_URL=http://localhost:3000
```

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Features

- Email/password signup and login
- PDF and DOCX resume upload with drag-and-drop UI
- Resume parsing into structured JSON
- ATS score out of 100
- AI or local NLP analysis fallback
- Job role match percentage and missing skills
- Improved resume generator
- Downloadable PDF analysis report
- Dark mode toggle
- Resume analysis history

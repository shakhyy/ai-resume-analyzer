# AI Resume Analyzer - Complete Code Handoff

This workspace contains a full-stack SaaS-style application with:

- Next.js App Router frontend
- Tailwind CSS premium blue/white UI with dark mode
- Node.js + Express backend
- MongoDB + Mongoose persistence
- PDF/DOCX upload and parsing
- ATS score, job match, missing skills, suggestions, weak sections
- Optional OpenAI-powered analysis and rewrite fallback logic
- Resume history and downloadable PDF report

## Folder Structure

```txt
resume analyzer/
  package.json
  README.md
  COMPLETE_CODE.md
  backend/
    server.js
    package.json
    .env.example
    controllers/
      authController.js
      resumeController.js
    middleware/
      auth.js
    models/
      Resume.js
      User.js
    routes/
      authRoutes.js
      resumeRoutes.js
    utils/
      resumeParser.js
    uploads/
  frontend/
    package.json
    .env.example
    app/
      page.tsx
      layout.tsx
      globals.css
      login/page.tsx
      signup/page.tsx
      dashboard/page.tsx
      upload/page.tsx
      analysis/[id]/page.tsx
    components/
      AppShell.tsx
      AuthForm.tsx
    lib/
      api.ts
      types.ts
      utils.ts
```

## How To Run

Install dependencies:

```bash
npm install
```

Create env files:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env.local
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_resume_analyzer
JWT_SECRET=replace_with_a_long_random_secret
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
CLIENT_URL=http://localhost:3000
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start MongoDB locally, then run:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Important Files

- `backend/server.js`: Express server, middleware, route mounting, MongoDB connection
- `backend/routes/resumeRoutes.js`: Upload, history, detail, improve, report endpoints
- `backend/controllers/resumeController.js`: Resume analysis workflow and PDF report generation
- `backend/utils/resumeParser.js`: PDF/DOCX text extraction, parser, ATS scoring, job role skill matching
- `frontend/app/page.tsx`: Landing page
- `frontend/app/upload/page.tsx`: Drag-and-drop upload UI
- `frontend/app/analysis/[id]/page.tsx`: ATS score and analysis result UI
- `frontend/app/dashboard/page.tsx`: Resume history and summary metrics

## API Routes

```txt
POST /api/auth/signup
POST /api/auth/login
GET  /api/resumes
POST /api/resumes/upload
GET  /api/resumes/:id
POST /api/resumes/:id/improve
GET  /api/resumes/:id/report
```

## OpenAI Behavior

The backend works without an OpenAI key using local NLP-style scoring and rewrite logic.

When `OPENAI_API_KEY` is set, it enhances:

- Missing skills
- Suggestions
- Weak sections
- Improved resume content

## Output Example

```txt
ATS Score: 78/100

Sections:
- Extracted Skills
- Missing Skills
- Suggestions
- Job Match %
```

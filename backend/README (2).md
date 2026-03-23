Murder in Westeros — GOT Murder Mystery Game

A full-stack Game of Thrones murder mystery powered by Claude AI (FastAPI + React).

---
 Project Structure

```
got_murder_mystery/
├── backend/
│   ├── main.py            # FastAPI server
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        └── App.jsx        # Full game UI
```

---



1. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt


uvicorn main:app --reload --port 8000
```

Backend runs at → http://localhost:8000  
API docs at → http://localhost:8000/docs

---

2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at → http://localhost:3000


---
 API Endpoints

| Method | Path        | Description                      |
|--------|-------------|----------------------------------|
| POST   | `/new-game` | Generate a new mystery scenario  |
| POST   | `/guess`    | Submit a guess for the killer    |
| GET    | `/health`   | Health check                     |

---
 Tech Stack

- **Backend**: Python, FastAPI, Anthropic Claude API
- **Frontend**: React 18, Vite, CSS-in-JS (no external UI library)
- **AI**: Claude Sonnet 4 generates unique GOT murder scenarios each game

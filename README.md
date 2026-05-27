# AI Code Review Platform

A production-grade, real-time collaborative code editor with AI-powered code reviews, security scanning, complexity analysis, and AST visualization.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (React + Vite)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐   │
│  │  Monaco   │  │   AI     │  │ Security │  │    AST    │   │
│  │  Editor   │  │ Feedback │  │  Panel   │  │  Viewer   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬─────┘   │
│       │              │              │              │         │
│  ┌────┴──────────────┴──────────────┴──────────────┴────┐   │
│  │              Socket.io Client + Zustand                │   │
│  └────────────────────────┬──────────────────────────────┘   │
├───────────────────────────┼──────────────────────────────────┤
│                    Server (Express + TS)                      │
│  ┌────────────────────────┴──────────────────────────────┐   │
│  │                   Socket.io Server                      │   │
│  │   - Code sync (100ms debounced)                        │   │
│  │   - Cursor sync (per keystroke)                        │   │
│  │   - Room-based sessions                                │   │
│  └─────────┬──────────┬──────────┬───────────────────────┘   │
│            │          │          │                           │
│  ┌─────────┴──────────┴──────────┴───────────────────────┐   │
│  │              BullMQ Queue + Worker                      │   │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │   │
│  │   │  Gemini  │  │  Babel   │  │ Security Scanner │    │   │
│  │   │    AI    │  │   AST    │  │  (Regex + CWE)   │    │   │
│  │   └──────────┘  └──────────┘  └──────────────────┘    │   │
│  └───────────────────────┬────────────────────────────────┘   │
│                          │                                     │
│  ┌───────────────────────┴────────────────────────────────┐   │
│  │           PostgreSQL (Supabase) + Redis (Upstash)       │   │
│  └────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Monaco Editor, Tailwind CSS |
| State | Zustand (global), React Query (server) |
| Real-time | Socket.io |
| Backend | Node.js, Express.js, TypeScript |
| AI | Google Gemini API |
| Database | PostgreSQL (Supabase) + Prisma ORM |
| Cache/Queue | Upstash Redis + BullMQ |
| Auth | Supabase Auth (JWT) |
| AST | @babel/parser, @babel/traverse |
| Charts | Recharts, D3.js |
| DevOps | Docker, GitHub Actions |

## Setup

### Prerequisites
- Node.js 20+
- Docker Desktop (for local PostgreSQL + Redis)
- Supabase account (free tier)
- Google Gemini API key (free tier)
- Upstash Redis account (free tier)

### Local Development

```bash
# 1. Start local infrastructure
docker compose up -d

# 2. Server setup
cd server
cp .env.example .env  # Edit with your keys
npm install
npx prisma generate
npx prisma db push
npm run dev

# 3. Client setup (new terminal)
cd client
cp .env.example .env
npm install
npm run dev
```

### Environment Variables

See `server/.env.example` and `client/.env.example` for all required variables.

## Features

- **AI-Powered Code Reviews**: Gemini analyzes code for bugs, security issues, and best practices
- **Real-Time Collaboration**: Multiple users can edit code simultaneously with live cursor sync
- **Security Scanning**: CWE-mapped vulnerability detection (SQLi, XSS, hardcoded secrets, etc.)
- **Complexity Analysis**: Big-O time/space complexity with per-function cyclomatic complexity
- **AST Visualization**: Interactive D3.js force graph of the code's syntax tree
- **Code Comments**: Inline code review comments with resolve/unresolve
- **Keyboard Shortcuts**: `Ctrl+Shift+R` to trigger a review
- **Shareable Sessions**: Generate read-only share links via `shareToken`

## Socket Events

See `SOCKET.IO EVENTS` in the project specification for full reference.

## Interview Talking Points

- "I implemented real-time collaboration using Socket.io with room-based architecture and cursor sync via Monaco's `deltaDecorations` API"
- "AI reviews are processed asynchronously using BullMQ job queues so the UI never blocks"
- "I built an AST parser using Babel that computes cyclomatic complexity per function and renders it as a D3 force graph"
- "Security scanning maps findings to CWE identifiers, the same standard used by OWASP and NVD"
- "Rate limiting is implemented at the middleware level using Redis sliding window algorithm via Upstash"
- "The CI/CD pipeline runs TypeScript type-checking, ESLint, and build verification on every push"

# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Monorepo (workspaces): backend (Node/Express/Mongoose/Socket.io) and frontend (React 18 + Vite + MUI + React Query). Docker and docker-compose provided for local orchestration.
- Default dev ports: frontend 3000, backend 5000. API is exposed under /api. Vite dev server proxies /api to the backend.

Common commands
Note: Run these from the indicated directory.

Repository root
- Install all workspace deps (npm workspaces):
  pwsh: npm install

Backend (./backend)
- Development (with auto-reload):
  pwsh: npm run dev
- Start (production-style):
  pwsh: npm start
- Lint all files:
  pwsh: npm run lint
- Health check (once running):
  pwsh: curl http://localhost:5000/health

Frontend (./frontend)
- Development server (Vite):
  pwsh: npm run dev
- Build production assets:
  pwsh: npm run build
- Preview built app locally:
  pwsh: npm run preview
- Lint all files:
  pwsh: npm run lint

Docker (from repo root)
- Build and start all services (frontend, backend, mongo, redis, nginx):
  pwsh: docker-compose up --build
- Stop services:
  pwsh: docker-compose down

Testing
- No test scripts are configured in backend or frontend package.json. Add tests before attempting single-test runs.

Environment configuration
- Backend expects a .env in ./backend with at least:
  - MONGODB_URI
  - JWT_SECRET
  - PORT (default 5000 if omitted)
  - NODE_ENV (e.g., development)
  - CLIENT_URL (frontend origin, e.g., http://localhost:3000)
- Frontend uses Vite proxy for /api in development (see frontend/vite.config.js). Axios baseURL is '/api' (frontend/src/services/api.js). In production, ensure /api is routed to backend by your reverse proxy or hosting platform.

High-level architecture
Backend (Node/Express/Mongoose/Socket.io)
- Entry: backend/server.js
  - Loads env, connects Mongo (backend/config/db.js) with lifecycle handlers and SIGINT cleanup.
  - Creates HTTP server and attaches Socket.io. CORS origin defaults to CLIENT_URL or http://localhost:3000.
  - Exposes Socket.io instance on app via app.set('io') for route/controller access.
  - Registers routes:
    - /api/auth → routes/authRoutes.js
    - /api/events → routes/eventRoutes.js
    - /api/registrations → routes/registrationRoutes.js
    - /api/users → routes/userRoutes.js
  - Middlewares: CORS (credentials true), JSON/urlencoded body parsing, morgan logging, error handler, 404.
  - Health endpoint: GET /health.
- Realtime events (server.js):
  - 'join-room' to join named rooms (e.g., 'admin').
  - 'event-updated' broadcast to all except sender.
  - 'new-registration' emits to the 'admin' room.
- Data models (backend/models):
  - User: auth fields, role (student/admin), password hashing, comparePassword, stats aggregation, profile virtuals.
  - Event: rich schema with dateTime/registration/analytics/feedback, virtuals (duration, registrationStatus, isAvailable), indexes and statics (getUpcoming/getByCategory/getAnalytics).
  - Registration: stored under models; controllers coordinate constraints and updates (see routes/controllers pairing).
- Auth: middleware/auth.js (JWT-based), used in protected routes (see README for endpoints). Ensure CLIENT_URL aligns with frontend to avoid CORS/auth mismatches.

Frontend (React 18 + Vite + MUI + React Query)
- App composition (frontend/src/App.jsx):
  - QueryClientProvider (React Query) with conservative refetch/retry defaults.
  - ThemeProvider (MUI) + CssBaseline, custom palette/typography.
  - Contexts: AuthProvider, NotificationProvider, SocketProvider wrap Router/Layout.
  - Routing: Public routes (/, /login, /register, /events, /events/:id), Protected routes (/dashboard, /profile, /my-registrations), Admin section under /admin/* guarded by ProtectedRoute with adminOnly.
- API client (frontend/src/services/api.js):
  - Axios instance with baseURL '/api'; request interceptor injects Bearer token from localStorage; response 401 clears token and redirects to /login.
- Dev proxy (frontend/vite.config.js):
  - Proxies '/api' → http://localhost:5000 in dev; build outputs to frontend/build with sourcemaps.
- State and realtime:
  - AuthContext manages token storage, profile bootstrap via /auth/profile, and user updates.
  - SocketContext establishes client Socket.io connection for live updates (e.g., registrations, event updates).

Deployment notes
- docker-compose.yml defines services: backend, frontend, mongo, redis, nginx, and a user-defined bridge network. Frontend and backend mount source via bind volumes for iterative dev in containers.
- Ensure production reverse proxy routes /api to backend and serves the built frontend. In this repo, docker-compose maps an nginx/conf at ./nginx/nginx.conf, but the nginx directory is not present at repo root while a sample nginx.conf exists at ./frontend/nginx.conf. Align paths before using the nginx service.

Cross-cutting behavior
- API paths are all under /api; frontend assumes that path at the same origin in dev and prod. Adjust axios baseURL or reverse proxy config if deploying with different origins.
- Socket.io CORS and CLIENT_URL must match the frontend origin to establish websocket connections.

Key discovery paths (when investigating issues)
- Backend startup and sockets: backend/server.js
- Database connectivity: backend/config/db.js
- Auth flow: frontend/src/context/AuthContext.jsx and backend/auth routes/controllers
- API client and interceptors: frontend/src/services/api.js
- Route protection/UI composition: frontend/src/components/Auth/ProtectedRoute.jsx and frontend/src/App.jsx


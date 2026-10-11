# 🎓 CampusSync — Real-Time College Event Management Portal

A full-stack event discovery and administration platform built with the **MERN** stack, **Socket.io**, and **Docker**. CampusSync simplifies campus event discovery and attendance management for students while giving university administrators real-time analytics and participant control.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Material UI](https://img.shields.io/badge/MUI-v5-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.x-black?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/WebSockets-Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## 🌟 Key Highlights & System Capabilities

- ⚡ **Bi-Directional Real-Time Communications**: Powered by **Socket.io** WebSockets, instantly broadcasting event creation, schedule changes, seat vacancy counters, and registration notifications without page refreshes.
- 👥 **Role-Based Access Control (RBAC)**: Distinct permission workflows for Students (registration, personal attendance passport) and Admins (event CRUD, attendance roster exports, capacity limits).
- 🎨 **Modern Accessible UI**: Designed with Material-UI (MUI v5) following responsive mobile-first patterns and WCAG accessibility standards.
- 🐳 **Containerized Deployment**: Ready-to-deploy multi-container orchestration with Docker and Docker Compose.
- 🔐 **Security Best Practices**: Stateless JWT authentication, bcrypt salt rounds for password safety, and Multer file upload validation for event promotional banners.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│             Student & Admin Client (React 18)          │
│  • Material-UI Design System   • React Hook Form       │
│  • Socket.io Client Listener   • Axios HTTP Interceptor│
└───────────────┬────────────────────────┬───────────────┘
                │ HTTP REST Requests     │ WebSocket Events
                ▼                        ▼
┌────────────────────────────────────────────────────────┐
│            Event Backend (Node.js + Express)           │
│  • JWT Authentication Middleware                       │
│  • Socket.io Server (Real-time Broadcast Hub)          │
│  • Event & Registration Controllers                    │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
        ┌───────▼────────┐       ┌───────▼────────┐
        │  MongoDB Atlas │       │  Local Storage │
        │  (Users, Events│       │  / Cloudinary  │
        │  Registrations)│       │ (Event Posters)│
        └────────────────┘       └────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies | Role / Rationale |
|---|---|---|
| **Frontend** | React 18, React Router v6 | Declarative component hierarchy and client-side routing |
| **Component Library** | Material-UI (MUI v5), Emotion | Pre-built accessible UI primitives with responsive theming |
| **Real-Time Layer** | Socket.io Client & Server | Low-latency bi-directional event notifications |
| **Backend Runtime** | Node.js, Express.js | High-throughput asynchronous event handling |
| **Database** | MongoDB Atlas, Mongoose | Schema-validated NoSQL persistence |
| **DevOps & Containers**| Docker, Docker Compose | Consistent multi-environment runtime encapsulation |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster URL (or local MongoDB daemon)
- Docker & Docker Compose (optional for containerized run)

### 1. Clone the Repository
```bash
git clone https://github.com/Rajan-vish/college-portfolio.git
cd college-portfolio
```

### 2. Local Development Setup

**Backend Setup:**
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

**Frontend Setup:**
In a separate terminal:
```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

Start the frontend application:
```bash
npm start
```

Visit `http://localhost:3000` in your browser.

---

### 3. Docker Compose Orchestration

To run the complete ecosystem (frontend and backend) with Docker:
```bash
docker-compose up --build
```

---

## 📡 API Specification

### Authentication
- `POST /api/auth/register` — Register a new student or organizer account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/profile` — Fetch authenticated user details

### Events
- `GET /api/events` — Retrieve list of active college events
- `POST /api/events` — Create a new event listing (Admin only)
- `PUT /api/events/:id` — Update event details (Admin only)
- `DELETE /api/events/:id` — Cancel/delete event (Admin only)

### Registrations
- `POST /api/registrations` — Register for an event
- `GET /api/registrations/user/:userId` — Retrieve user's registration history
- `GET /api/registrations/event/:eventId` — Retrieve attendee list for an event (Admin only)

---

## 👨‍💻 Author

**Rajan Kumar Vishwakarma**
- GitHub: [@Rajan-vish](https://github.com/Rajan-vish)
- Email: [rajanvish2005@gmail.com](mailto:rajanvish2005@gmail.com)
- LinkedIn: [linkedin.com/in/rajan-kumar-vishwakarma-1a4bb92a8](https://www.linkedin.com/in/rajan-kumar-vishwakarma-1a4bb92a8/)
- Codeforces: [rajan_pant (Specialist - 1420)](https://codeforces.com/profile/rajan_pant)
- LeetCode: [unbitten (614+ Solved)](https://leetcode.com/u/unbitten/)

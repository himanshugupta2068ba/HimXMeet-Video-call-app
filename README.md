# HIMX MEET

Live Deployment: https://himxmeet-video-call-app-frontend.onrender.com/

HIMX MEET is a browser-based real-time video conferencing app inspired by modern meeting platforms. It supports user authentication, guest access, WebRTC-based video/audio calling, in-call chat, and meeting activity history.

## Project Overview

This project is split into two parts:

- Frontend: React + Vite app for UI, routing, authentication flows, meeting room, chat, and profile/history pages.
- Backend: Node.js + Express + Socket.IO + MongoDB service for auth, activity tracking, and real-time signaling.

The application lets users:

- Register and log in
- Join as a guest
- Start/join calls using meeting codes
- Exchange live chat messages during calls
- Track meeting history and profile statistics (for authenticated users)

## Deployment

- Frontend (Render): https://himxmeet-video-call-app-frontend.onrender.com/
- Backend API base (default production): https://himxmeet-video-call-app.onrender.com

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Material UI (MUI)
- Socket.IO Client
- Axios
- Framer Motion

### Backend

- Node.js
- Express
- Socket.IO
- MongoDB + Mongoose
- bcrypt (password hashing)
- dotenv (environment configuration)

## How It Works

### 1. Authentication and Session

- Users can register with name, username, and password.
- Passwords are hashed before storage.
- On login, the backend issues a token and returns user profile basics.
- The frontend stores session data in localStorage.
- Guests are assigned a temporary local guest token.

### 2. Real-Time Calling

- Users enter a meeting code and join a room.
- Socket.IO is used for signaling events:
	- room join
	- SDP/ICE exchange
	- participant join/leave events
- WebRTC peer connections handle actual media streaming.

### 3. In-Call Chat

- Chat messages are sent over Socket.IO.
- Messages are broadcast to participants in the same room.

### 4. Meeting Activity and Profile

- Authenticated users get activity records for meetings.
- Meeting metadata includes start/end and duration values.
- Profile aggregates are derived from activity history.
- Guest sessions can join calls but are not persisted as full account history.

## Repository Structure

```text
backend/
	src/
		app.js
		controllers/
		models/
		routes/

frontend/
	src/
		pages/
		contexts/
		styles/
		utils/
```

## Local Development Setup

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (local or cloud)

## 1) Clone and Install

```bash
git clone <your-repo-url>
cd ZOOM

cd backend
npm install

cd ../frontend
npm install
```

## 2) Environment Variables

### Backend: backend/.env

```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/zoom
FRONTEND_URLS=http://localhost:5173
TOKEN_TTL_HOURS=168
```

### Frontend: frontend/.env.local

```env
VITE_API_URL=http://localhost:8000
```

## 3) Run the Project

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend should run at http://localhost:5173 and communicate with backend at http://localhost:8000.

## Scripts

### Backend

- npm run dev: Start backend with nodemon
- npm run start: Start backend with node
- npm run prod: Start backend with pm2

### Frontend

- npm run dev: Start Vite dev server
- npm run build: Build for production
- npm run preview: Preview production build
- npm run lint: Run linting

## Key Product Notes

- Uses WebRTC signaling over Socket.IO for real-time calls.
- Designed for multi-user room-based meetings.
- Includes guest mode for frictionless access.
- Includes profile and activity history for logged-in users.

## Future Improvements

- Add JWT-based auth middleware with refresh strategy
- Add stronger API rate-limiting and abuse protection
- Persist chat history with retention rules
- Add tests (unit + integration + end-to-end)
- Add CI/CD workflows for automated quality checks

## License

ISC (as defined in backend package metadata).

# ZOOM

A browser-based video meeting app with authentication, meeting history, chat, and guest entry.

## What was fixed

- Broken `/home` route in the frontend router.
- Dead `Join as Guest` flow on the landing page.
- Guest users now get a usable temporary session instead of hitting a 404.
- Backend MongoDB, CORS, and Socket.IO settings now come from environment variables.
- History writes are skipped for guest sessions.
- Video meeting join rooms now use the pathname instead of the full URL.

## Local setup

### Backend

1. Copy `backend/.env.example` to `backend/.env`.
2. Set your values:

```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/zoom
FRONTEND_URLS=http://localhost:5173
```

3. Install and start:

```bash
cd backend
npm install
npm run dev
```

### Frontend

1. Copy `frontend/.env.example` to `frontend/.env.local`.
2. Set your API URL:

```env
VITE_API_URL=http://localhost:8000
```

3. Install and start:

```bash
cd frontend
npm install
npm run dev
```

## Deployment notes

- Set `MONGODB_URI` on the backend deployment.
- Set `FRONTEND_URLS` to the deployed frontend URL, or multiple URLs separated by commas.
- Set `VITE_API_URL` on the frontend deployment to the deployed backend URL.
- Do not commit real `.env` files.

## Guest flow

Guest sessions are intentionally temporary.

- Guests can enter from the landing page or the auth navbar.
- Guests can join meetings.
- Guest activity is not stored in meeting history.
- A guest token is stored locally only for the current browser session.

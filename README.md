# EventMate 3.0

This project keeps your current EventMate features and aligns backend/frontend layout for easier deployment.

Reference backend used: `https://github.com/eventmate2026/EventMate.git` (cloned locally for architecture reference).

## Project Structure

```text
EventMate 3.0/
  Backend/
    src/
      config/
        cors.js
        db.js
        env.js
        sendEmail.js
      controllers/
      middleware/
      models/
      routes/
        index.js
      utils/
      validators/
    scripts/
      createAdmin.js
    .env.example
    Dockerfile
    server.js
  Frontend/
    src/
      app/
      features/
      shared/
    .env.example
    Dockerfile
    nginx.conf
  docker-compose.yml
  package.json
```

## Existing Features Preserved

- Auth: register, verify email, login, logout, refresh token
- User: profile update, avatar upload, forgot/reset password
- Admin: user/organizer/coordinator management
- Events: create/update/public listing/details, registration (individual/team)
- Coordinator and organizer activity flows
- Contact admin messaging and unread/read tracking

## Local Development

1. Backend

```bash
cd Backend
npm install
cp .env.example .env
npm run dev
```

2. Frontend

```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

## Root Scripts

From project root:

```bash
npm run dev:backend
npm run dev:frontend
npm run check:backend
npm run create-admin
```

## Docker Deployment

1. Set backend env values in `Backend/.env` (use `Backend/.env.example`).
2. Use compose:

```bash
docker compose up --build -d
```

Services:
- Frontend: `http://localhost`
- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## Deployment Notes

- For Docker compose with bundled frontend, frontend build arg is `VITE_API_URL=/` and Nginx proxies `/api` to backend.
- For separate hosting (e.g., Vercel + Render), set:
  - `Frontend` env `VITE_API_URL=https://your-backend-domain`
  - `Backend` env `FRONTEND_URL=https://your-frontend-domain`

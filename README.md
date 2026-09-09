# BookCrossing

BookCrossing is a Vite frontend with an Express REST API, SQLite database, JWT HTTP-only cookie sessions, and bcrypt password hashing.

## Setup

Requirements: Node.js 20+ and npm.

```powershell
npm install
Copy-Item .env.example .env
npm run server:seed
```

Set a long random `JWT_SECRET` in `.env`. Local defaults use port `4000` for the API and port `5173` for Vite.

Demo accounts use password `BookCrossing123!`:

- `amelia@example.com` / `BookCrossing123!`
- `daniyar@example.com` / `BookCrossing123!`

Run in separate terminals:

```powershell
npm run server
npm run dev
```

Or run both together:

```powershell
npm run dev:full
```

The SQLite database is stored in `server/bookcrossing.sqlite` and is created automatically. No MongoDB service is required.

## API

All endpoints are under `/api`:

- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- `GET /books`, `GET /books/:id`, `POST /books`, `PUT /books/:id`, `DELETE /books/:id`
- `POST /swaps`, `GET /swaps/incoming`, `GET /swaps/outgoing`
- `PUT /swaps/:id/accept`, `/reject`, `/complete`
- `GET /users/:id`, `PUT /users/me`
- `POST /feedback`

JWT sessions are stored in an HTTP-only `token` cookie. Auth routes have rate limiting, incoming fields are validated with Zod, passwords are hashed with bcryptjs, and ownership is checked for books and swap decisions.

## Production

```powershell
npm run build
```

Set `SERVE_DIST=true` in `.env`, then run `npm start` to serve the built frontend and API from Express.

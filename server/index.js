import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import api from './routes/api.js'
import db from './db.js'

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required. Copy .env.example to .env first.')
const app = express()
const port = Number(process.env.PORT || 4000)
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(cors({ origin: frontendOrigin, credentials: true }))
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: 'draft-8', legacyHeaders: false }))
app.use('/api', api)
app.get('/api/health', (_request, response) => response.json({ ok: true, database: 'sqlite' }))
if (process.env.SERVE_DIST === 'true') { app.use(express.static(path.resolve(__dirname, '../dist'))); app.get('*', (_request, response) => response.sendFile(path.resolve(__dirname, '../dist/index.html'))) }
app.use((error, _request, response, _next) => { console.error(error); response.status(500).json({ error: 'Something went wrong on the server' }) })

app.listen(port, () => console.log(`BookCrossing API listening on http://localhost:${port}`))
process.on('SIGINT', () => { db.close(); process.exit(0) })
process.on('SIGTERM', () => { db.close(); process.exit(0) })

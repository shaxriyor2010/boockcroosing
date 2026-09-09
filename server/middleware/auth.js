import jwt from 'jsonwebtoken'
import db from '../db.js'

export function requireAuth(request, response, next) {
  const token = request.cookies?.token
  if (!token) return response.status(401).json({ error: 'Authentication required' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = db.prepare('SELECT id, full_name, username, email, avatar_url, created_at FROM users WHERE id = ?').get(payload.userId)
    if (!user) return response.status(401).json({ error: 'User no longer exists' })
    request.user = user
    next()
  } catch {
    return response.status(401).json({ error: 'Invalid or expired session' })
  }
}

export function optionalAuth(request, _response, next) {
  const token = request.cookies?.token
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      request.user = db.prepare('SELECT id, full_name, username, email, avatar_url, created_at FROM users WHERE id = ?').get(payload.userId)
    } catch {
      request.user = null
    }
  }
  next()
}

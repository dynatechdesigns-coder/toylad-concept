import bcrypt from 'bcryptjs'
import { authConfigured, clearSessionCookie, createSessionCookie, hasSession } from '../_lib/auth.js'
import { HttpError, readJson, route } from '../_lib/http.js'

// One function serves /api/auth/login, /logout and /me, to stay within Vercel's limit of 12 functions.

const WINDOW_MS = 15 * 60 * 1000
const MAX_FAILURES = 10
// Failed attempts per IP. Lives in this warm instance only, so it is best-effort.
const failures = new Map()

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const actions = {
  login: route({
    async POST(req, res) {
      if (!authConfigured()) throw new HttpError(503, 'Admin login is not set up yet.')

      const { password } = readJson(req)
      if (typeof password !== 'string' || !password || password.length > 200) {
        throw new HttpError(400, 'Please enter your password.')
      }

      const ip = String(req.headers['x-forwarded-for'] ?? 'unknown').split(',')[0].trim()
      const record = failures.get(ip)
      const recent = record && Date.now() - record.last < WINDOW_MS ? record.count : 0
      if (recent >= MAX_FAILURES) {
        throw new HttpError(429, 'Too many wrong passwords. Please wait 15 minutes and try again.')
      }

      if (!(await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH))) {
        failures.set(ip, { count: recent + 1, last: Date.now() })
        // Each wrong password makes the next answer slower, up to 5 seconds.
        await wait(Math.min((recent + 1) * 1000, 5000))
        throw new HttpError(401, 'Wrong password. Please try again.')
      }

      failures.delete(ip)
      res.setHeader('Set-Cookie', await createSessionCookie())
      return { authenticated: true }
    },
  }),

  logout: route({
    POST(req, res) {
      res.setHeader('Set-Cookie', clearSessionCookie())
      return { authenticated: false }
    },
  }),

  me: route({
    async GET(req) {
      return { authenticated: await hasSession(req) }
    },
  }),
}

export default function handler(req, res) {
  const action = actions[req.query.action]
  if (!action) return res.status(404).json({ error: 'Not found.' })
  return action(req, res)
}

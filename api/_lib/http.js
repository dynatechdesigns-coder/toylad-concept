import { hasSession } from './auth.js'

// Thrown anywhere in a handler to send `{ error: message }` with that status.
export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// Browsers send Origin on cross-site writes; reject any that do not match this site.
function sameOrigin(req) {
  const { origin } = req.headers
  if (!origin) return true
  try {
    return new URL(origin).host === (req.headers['x-forwarded-host'] ?? req.headers.host)
  } catch {
    return false
  }
}

// Wraps `{ GET, POST, … }` handlers: each returns the JSON body. `auth: true` requires the owner session.
export function route(handlers, { auth = false } = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store')
    try {
      const handle = handlers[req.method]
      if (!handle) {
        res.setHeader('Allow', Object.keys(handlers).join(', '))
        throw new HttpError(405, 'Method not allowed.')
      }
      if (req.method !== 'GET' && !sameOrigin(req)) throw new HttpError(403, 'Request blocked.')
      if (auth && !(await hasSession(req))) throw new HttpError(401, 'Please log in again.')
      const body = await handle(req, res)
      res.status(res.statusCode).json(body)
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json({ error: error.message })
        return
      }
      console.error(error)
      res.status(500).json({ error: 'Something went wrong. Please try again.' })
    }
  }
}

export function readJson(req) {
  let body
  try {
    body = req.body
  } catch {
    throw new HttpError(400, 'The request was not valid JSON.')
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'Send the details as JSON.')
  }
  return body
}

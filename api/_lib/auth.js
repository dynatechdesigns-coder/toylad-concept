import { SignJWT, jwtVerify } from 'jose'

const COOKIE = 'toylad_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days, in seconds

export function authConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD_HASH) && (process.env.SESSION_SECRET ?? '').length >= 32
}

function secret() {
  return new TextEncoder().encode(process.env.SESSION_SECRET)
}

function cookie(value, maxAge) {
  // `vercel dev` serves plain http://localhost, where some browsers drop Secure cookies.
  const secure = process.env.VERCEL_ENV === 'development' ? '' : ' Secure;'
  return `${COOKIE}=${value}; Path=/; HttpOnly;${secure} SameSite=Lax; Max-Age=${maxAge}`
}

export async function createSessionCookie() {
  const token = await new SignJWT({ role: 'owner' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret())
  return cookie(token, MAX_AGE)
}

export function clearSessionCookie() {
  return cookie('', 0)
}

export async function hasSession(req) {
  if (!authConfigured()) return false
  const token = (req.headers.cookie ?? '')
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1)
  if (!token) return false
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'] })
    return payload.role === 'owner'
  } catch {
    return false
  }
}

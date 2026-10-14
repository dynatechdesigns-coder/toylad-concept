// A simple per-address limiter for public routes: at most `max` calls in `windowMs`.
// The table lives in this warm serverless instance only, so the limit is best-effort.
export function rateLimiter({ windowMs, max }) {
  const recent = new Map()

  // Returns true when this request is over the limit. Counts the request otherwise.
  return function tooMany(req) {
    const ip = String(req.headers['x-forwarded-for'] ?? 'unknown').split(',')[0].trim()
    const now = Date.now()
    const times = (recent.get(ip) ?? []).filter((time) => now - time < windowMs)
    if (times.length >= max) return true
    recent.set(ip, [...times, now])
    return false
  }
}

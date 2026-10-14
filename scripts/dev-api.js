// Vite plugin: serves the /api functions during `npm run dev`, the way Vercel does in production.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { parseEnv } from 'node:util'

// Maps a URL path to its file in /api, e.g. /api/admin/photos/abc -> api/admin/photos/[id].js with query.id = 'abc'
function resolveRoute(pathname) {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.some((part) => part.startsWith('_') || part.startsWith('.'))) return null

  const base = parts.join('/')
  if (existsSync(`${base}.js`)) return { file: `${base}.js`, query: {} }
  if (existsSync(`${base}/index.js`)) return { file: `${base}/index.js`, query: {} }
  const folder = path.posix.dirname(base)
  const dynamic = existsSync(folder) && readdirSync(folder).find((name) => /^\[\w+\]\.js$/.test(name))
  if (!dynamic) return null
  return { file: `${folder}/${dynamic}`, query: { [dynamic.slice(1, -4)]: decodeURIComponent(parts.at(-1)) } }
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8')
}

export default function devApi() {
  return {
    name: 'toylad-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost')
        if (!url.pathname.startsWith('/api/')) return next()

        // Read .env on every request so new values work without a restart. No `$` expansion,
        // so the bcrypt hash stays intact. Plain http://localhost cannot use Secure cookies.
        if (existsSync('.env')) Object.assign(process.env, parseEnv(readFileSync('.env', 'utf8')))
        process.env.VERCEL_ENV = 'development'

        // The same helpers Vercel adds to Node functions.
        res.status = (code) => {
          res.statusCode = code
          return res
        }
        res.json = (body) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(body))
        }

        const found = resolveRoute(url.pathname)
        if (!found) return res.status(404).json({ error: 'Not found.' })

        try {
          const raw = await readBody(req)
          const isJson = (req.headers['content-type'] ?? '').includes('application/json')
          req.query = { ...Object.fromEntries(url.searchParams), ...found.query }
          // Like Vercel, invalid JSON only fails when the handler reads `req.body`.
          Object.defineProperty(req, 'body', { get: () => (raw && isJson ? JSON.parse(raw) : raw || undefined) })

          const handler = (await server.ssrLoadModule(`/${found.file}`)).default
          await handler(req, res)
        } catch (error) {
          console.error(error)
          if (!res.writableEnded) res.status(500).json({ error: 'Something went wrong. Please try again.' })
        }
      })
    },
  }
}

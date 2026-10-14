import { getCloudinary } from '../_lib/cloudinary.js'
import { getDb } from '../_lib/db.js'
import { route } from '../_lib/http.js'

const REQUIRED = [
  'MONGODB_URI',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'ADMIN_PASSWORD_HASH',
  'SESSION_SECRET',
]

// Reports only whether each value is set and well-formed. Values are never returned.
function settingsCheck() {
  const items = REQUIRED.map((name) => ({ name, present: Boolean((process.env[name] ?? '').trim()) }))
  const hints = items.filter((item) => !item.present).map((item) => `${item.name} is missing. Add it in Vercel, then redeploy.`)

  for (const name of REQUIRED) {
    const value = process.env[name] ?? ''
    if (value && (value !== value.trim() || /^["']|["']$/.test(value))) {
      hints.push(`${name} has spaces or quote marks around it. Remove them in Vercel, then redeploy.`)
    }
  }
  const uri = (process.env.MONGODB_URI ?? '').trim()
  if (uri && !/^mongodb(\+srv)?:\/\//.test(uri)) hints.push('MONGODB_URI must start with mongodb+srv://')
  if (/[<>]/.test(uri)) {
    hints.push('MONGODB_URI still has < or > in it. Replace <password> with the real database password, without the brackets.')
  }
  return { id: 'settings', label: 'Settings (environment variables)', ok: hints.length === 0, hints, items }
}

function databaseHint(error) {
  const text = `${error?.name} ${error?.message}`
  if (/auth/i.test(text) || error?.code === 18 || error?.code === 8000) {
    return 'Database login failed: check the username and password inside MONGODB_URI. If the password has symbols such as @ or #, make a new one with only letters and numbers.'
  }
  if (/MongoParseError|MongoInvalidArgument|MongoAPIError|Invalid scheme/i.test(text)) {
    return 'MONGODB_URI is not a valid connection string. Copy it again from MongoDB Atlas (Connect, then Drivers).'
  }
  if (/ServerSelection|Network|ENOTFOUND|ETIMEDOUT|ECONNREFUSED|querySrv|timed out/i.test(text)) {
    return 'Database connection failed: check MONGODB_URI, and in MongoDB Atlas open Network Access and allow 0.0.0.0/0. Also check the cluster is not paused.'
  }
  return 'The database gave an unexpected error. Check MONGODB_URI and Network Access in MongoDB Atlas.'
}

async function databaseCheck() {
  const check = { id: 'database', label: 'Database (MongoDB)', ok: false, hints: [] }
  if (!(process.env.MONGODB_URI ?? '').trim()) return { ...check, hints: ['Not checked: MONGODB_URI is missing.'] }
  try {
    const db = await getDb()
    await db.command({ ping: 1 })
    return { ...check, ok: true }
  } catch (error) {
    console.error(error)
    return { ...check, hints: [databaseHint(error)], detail: [error?.name, error?.code].filter(Boolean).join(' ') }
  }
}

async function storageCheck() {
  const check = { id: 'storage', label: 'Photo storage (Cloudinary)', ok: false, hints: [] }
  const names = REQUIRED.filter((name) => name.startsWith('CLOUDINARY_'))
  if (names.some((name) => !(process.env[name] ?? '').trim())) {
    return { ...check, hints: ['Not checked: one of the CLOUDINARY values is missing.'] }
  }
  try {
    await getCloudinary().api.ping()
    return { ...check, ok: true }
  } catch (error) {
    console.error(error)
    const code = error?.error?.http_code ?? error?.http_code
    const hint =
      code === 401 || code === 403 || code === 404
        ? 'Photo storage login failed: check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET match the Cloudinary dashboard exactly.'
        : 'Photo storage did not answer. Try again in a minute; if it keeps failing, check the three CLOUDINARY values.'
    return { ...check, hints: [hint], detail: code ? `HTTP ${code}` : undefined }
  }
}

// Owner only: checks settings, database and photo storage, with a plain-English hint for each failure.
export default route(
  {
    async GET() {
      const checks = [settingsCheck(), ...(await Promise.all([databaseCheck(), storageCheck()]))]
      return { ok: checks.every((check) => check.ok), checks }
    },
  },
  { auth: true },
)

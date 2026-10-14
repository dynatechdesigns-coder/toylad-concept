import { buildCelebrations, sentCollection } from '../../_lib/celebrations.js'
import { GALLERY_FOLDER, getCloudinary } from '../../_lib/cloudinary.js'
import { customersCollection } from '../../_lib/customers.js'
import { getDb } from '../../_lib/db.js'
import { feedbackCollection, toFeedback } from '../../_lib/feedback.js'
import { HttpError, readJson, route } from '../../_lib/http.js'
import { leadsCollection } from '../../_lib/leads.js'
import { ordersCollection, todayInNigeria } from '../../_lib/orders.js'
import { buildReports } from '../../_lib/reports.js'
import { objectId } from '../../_lib/validate.js'

// One function serves /api/admin/tools/upload-signature, /health, /reports, /celebrations and /feedback, to stay within
// Vercel's limit of 12 functions. Every action requires the owner's session.

const REQUIRED = ['MONGODB_URI', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'ADMIN_PASSWORD_HASH', 'SESSION_SECRET']

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

const actions = {
  // Signs one direct browser-to-Cloudinary upload. The API secret never leaves the server.
  'upload-signature': {
    POST() {
      const cloudinary = getCloudinary()
      const timestamp = Math.round(Date.now() / 1000)
      const signature = cloudinary.utils.api_sign_request({ folder: GALLERY_FOLDER, timestamp }, process.env.CLOUDINARY_API_SECRET)
      return { cloudName: process.env.CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY, folder: GALLERY_FOLDER, timestamp, signature }
    },
  },

  // Checks settings, database and photo storage, with a plain-English hint for each failure.
  health: {
    async GET() {
      const checks = [settingsCheck(), ...(await Promise.all([databaseCheck(), storageCheck()]))]
      return { ok: checks.every((check) => check.ok), checks }
    },
  },

  // Occasions in the coming week (GET), and marking one as "wishes sent" for its year (POST).
  celebrations: {
    async GET() {
      const [customers, orders, sent] = await Promise.all(
        [await customersCollection(), await ordersCollection(), await sentCollection()].map((collection) => collection.find({}).limit(10000).toArray()),
      )
      return { celebrations: buildCelebrations({ customers, orders, sent }) }
    },
    async POST(req) {
      const { key, year } = readJson(req)
      const thisYear = Number(todayInNigeria().slice(0, 4))
      if (typeof key !== 'string' || !/^(birthday|anniversary|event):[0-9a-f]{24}$/.test(key)) throw new HttpError(400, 'That celebration is not valid.')
      if (!Number.isInteger(year) || Math.abs(year - thisYear) > 1) throw new HttpError(400, 'That year is not valid.')

      // Remember whose it is, so deleting the customer also removes this record.
      const [kind, id] = key.split(':')
      const _id = objectId(id)
      const customerId = kind === 'event' ? (await (await ordersCollection()).findOne({ _id }))?.customerId : _id
      if (!customerId || !(await (await customersCollection()).findOne({ _id: customerId }))) throw new HttpError(404, 'That customer no longer exists.')

      const sent = await sentCollection()
      await sent.updateOne({ key, year }, { $set: { key, year, customerId, sentAt: new Date() } }, { upsert: true })
      return { done: true }
    },
  },

  // Customer reviews: the list with its average (GET), show or hide one on the website (POST), delete one (DELETE ?id=…).
  feedback: {
    async GET() {
      const docs = await (await feedbackCollection()).find({}).sort({ createdAt: -1 }).limit(2000).toArray()
      const average = docs.length === 0 ? null : Math.round((docs.reduce((sum, doc) => sum + doc.rating, 0) / docs.length) * 10) / 10
      return { feedback: docs.map(toFeedback), average, count: docs.length }
    },
    async POST(req) {
      const { id, approved } = readJson(req)
      if (typeof approved !== 'boolean') throw new HttpError(400, '"approved" must be true or false.')
      const feedback = await feedbackCollection()
      const current = await feedback.findOne({ _id: objectId(id) })
      if (!current) throw new HttpError(404, 'That review no longer exists.')
      // The customer's permission comes first: without it a review can never be shown.
      if (approved && current.canPublish !== true) throw new HttpError(400, 'This customer did not give permission to show their review.')
      if (approved && !current.comment) throw new HttpError(400, 'This review has no words to show, only a rating.')
      const doc = await feedback.findOneAndUpdate({ _id: current._id }, { $set: { approved } }, { returnDocument: 'after' })
      return { feedback: toFeedback(doc) }
    },
    async DELETE(req) {
      const { deletedCount } = await (await feedbackCollection()).deleteOne({ _id: objectId(req.query.id) })
      if (deletedCount === 0) throw new HttpError(404, 'That review no longer exists.')
      return { deleted: true }
    },
  },

  // The numbers behind the Reports tab.
  reports: {
    async GET() {
      const [orders, customers, leads] = await Promise.all(
        [await ordersCollection(), await customersCollection(), await leadsCollection()].map((collection) => collection.find({}).limit(10000).toArray()),
      )
      return buildReports({ orders, customers, leads })
    },
  },
}

const handlers = Object.fromEntries(Object.entries(actions).map(([name, methods]) => [name, route(methods, { auth: true })]))

export default function handler(req, res) {
  const action = handlers[req.query.action]
  if (!action) return res.status(404).json({ error: 'Not found.' })
  return action(req, res)
}

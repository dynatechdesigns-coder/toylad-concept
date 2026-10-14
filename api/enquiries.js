import { customerValidators, customersCollection, saveCustomerFromEnquiry } from './_lib/customers.js'
import { HttpError, readJson, route } from './_lib/http.js'
import { leadValidators, leadsCollection, newLead } from './_lib/leads.js'
import { pickFields } from './_lib/validate.js'

const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
// Recent submissions per IP. Lives in this warm instance only, so it is best-effort.
const recent = new Map()

function tooMany(ip) {
  const now = Date.now()
  const times = (recent.get(ip) ?? []).filter((time) => now - time < WINDOW_MS)
  if (times.length >= MAX_PER_WINDOW) return true
  recent.set(ip, [...times, now])
  return false
}

const validators = { ...customerValidators, ...leadValidators }
const customerKeys = ['name', 'phone', 'email', 'birthday', 'anniversary', 'marketingConsent']
const leadKeys = ['service', 'package', 'eventDate', 'guests', 'details']

// Public: saves a copy of a booking-form enquiry. The form opens WhatsApp whether or not this succeeds.
export default route({
  async POST(req) {
    const { website, ...body } = readJson(req)
    // Honeypot: people never see this field, so anything in it came from a bot. Pretend it worked.
    if (website) return { ok: true }

    const ip = String(req.headers['x-forwarded-for'] ?? 'unknown').split(',')[0].trim()
    if (tooMany(ip)) throw new HttpError(429, 'Too many requests. Please try again in a few minutes.')

    const fields = pickFields(body, validators, { allowed: [...customerKeys, ...leadKeys], required: ['name', 'phone', 'service'] })

    const customer = await saveCustomerFromEnquiry(await customersCollection(), fields)
    const leads = await leadsCollection()
    await leads.insertOne(newLead(customer._id, fields, 'website'))
    return { ok: true }
  },
})

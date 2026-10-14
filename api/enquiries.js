import { customerValidators, customersCollection, saveCustomerFromEnquiry } from './_lib/customers.js'
import { HttpError, readJson, route } from './_lib/http.js'
import { leadValidators, leadsCollection, newLead } from './_lib/leads.js'
import { rateLimiter } from './_lib/rateLimit.js'
import { pickFields } from './_lib/validate.js'

const tooMany = rateLimiter({ windowMs: 10 * 60 * 1000, max: 5 })

const validators = { ...customerValidators, ...leadValidators }
const customerKeys = ['name', 'phone', 'email', 'birthday', 'anniversary', 'marketingConsent']
const leadKeys = ['service', 'package', 'eventDate', 'guests', 'details']

// Public: saves a copy of a booking-form enquiry. The form opens WhatsApp whether or not this succeeds.
export default route({
  async POST(req) {
    const { website, ...body } = readJson(req)
    // Honeypot: people never see this field, so anything in it came from a bot. Pretend it worked.
    if (website) return { ok: true }

    if (tooMany(req)) throw new HttpError(429, 'Too many requests. Please try again in a few minutes.')

    const fields = pickFields(body, validators, { allowed: [...customerKeys, ...leadKeys], required: ['name', 'phone', 'service'] })

    const customer = await saveCustomerFromEnquiry(await customersCollection(), fields)
    const leads = await leadsCollection()
    await leads.insertOne(newLead(customer._id, fields, 'website'))
    return { ok: true }
  },
})

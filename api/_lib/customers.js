import { getDb } from './db.js'
import { HttpError } from './http.js'
import { boolean, dayMonth, text } from './validate.js'

export async function customersCollection() {
  const customers = (await getDb()).collection('customers')
  // One customer per phone number. Created once per warm instance.
  globalThis.__toyladCustomerIndex ??= customers.createIndex({ phone: 1 }, { unique: true }).catch((error) => {
    globalThis.__toyladCustomerIndex = null
    throw error
  })
  await globalThis.__toyladCustomerIndex
  return customers
}

const badPhone = () => new HttpError(400, 'Please enter a valid phone number, e.g. 0801 234 5678.')

// Nigerian numbers become +234XXXXXXXXXX however they were typed. Other countries must start with +.
export function normalisePhone(value) {
  const raw = typeof value === 'string' ? value.replace(/[\s().-]/g, '') : ''
  let phone = raw
  if (/^0[789]\d{9}$/.test(raw)) phone = `+234${raw.slice(1)}`
  else if (/^234[789]\d{9}$/.test(raw)) phone = `+${raw}`
  else if (/^[789]\d{9}$/.test(raw)) phone = `+234${raw}`
  else if (/^\+2340[789]\d{9}$/.test(raw)) phone = `+234${raw.slice(5)}`

  if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw badPhone()
  if (phone.startsWith('+234') && !/^\+234[789]\d{9}$/.test(phone)) throw badPhone()
  return phone
}

const email = text('Email', { max: 200 })

export const customerValidators = {
  name: text('The name', { max: 100, required: true }),
  phone: normalisePhone,
  email(value) {
    const clean = email(value)
    if (clean && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) throw new HttpError(400, 'Please enter a valid email address.')
    return clean
  },
  birthday: dayMonth('The birthday'),
  anniversary: dayMonth('The anniversary'),
  marketingConsent: boolean('marketingConsent'),
  notes: text('Notes', { max: 5000 }),
}

export function toCustomer(doc) {
  return {
    id: String(doc._id),
    name: doc.name,
    phone: doc.phone,
    email: doc.email ?? null,
    birthday: doc.birthday ?? null,
    anniversary: doc.anniversary ?? null,
    marketingConsent: doc.marketingConsent === true,
    consentDate: doc.consentDate ?? null,
    notes: doc.notes ?? '',
    createdAt: doc.createdAt,
    lastContactAt: doc.lastContactAt,
  }
}

// Finds the customer with this phone or creates one. An existing customer keeps the details already
// on file: an enquiry only fills gaps and can turn marketing consent on, never off.
export async function saveCustomerFromEnquiry(customers, details, retry = true) {
  const now = new Date()
  const existing = await customers.findOne({ phone: details.phone })

  if (existing) {
    const $set = { lastContactAt: now }
    for (const key of ['name', 'email', 'birthday', 'anniversary']) {
      if (details[key] && !existing[key]) $set[key] = details[key]
    }
    if (details.marketingConsent && !existing.marketingConsent) {
      $set.marketingConsent = true
      $set.consentDate = now
    }
    await customers.updateOne({ _id: existing._id }, { $set })
    return { ...existing, ...$set }
  }

  const doc = { name: details.name, phone: details.phone, marketingConsent: details.marketingConsent === true, notes: '', createdAt: now, lastContactAt: now }
  for (const key of ['email', 'birthday', 'anniversary']) if (details[key]) doc[key] = details[key]
  if (doc.marketingConsent) doc.consentDate = now
  try {
    const { insertedId } = await customers.insertOne(doc)
    return { ...doc, _id: insertedId }
  } catch (error) {
    // Two enquiries from the same phone arrived together: the other one created the customer.
    if (error?.code === 11000 && retry) return saveCustomerFromEnquiry(customers, details, false)
    throw error
  }
}

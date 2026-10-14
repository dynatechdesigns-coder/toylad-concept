import { getDb } from './db.js'
import { HttpError } from './http.js'
import { oneOf, text } from './validate.js'

// Keep in sync with src/data/booking.js (services) and src/data/crm.js (the rest).
const SERVICES = ['cake', 'pastries', 'event-decoration', 'event-management']
const SOURCES = ['website', 'whatsapp', 'walk-in', 'phone']
const STATUSES = ['new', 'quoted', 'confirmed', 'delivered', 'lost']
const LOST_REASONS = ['price', 'date unavailable', 'went elsewhere', 'no response', 'other']
export const OPEN_STATUSES = ['new', 'quoted', 'confirmed']

const FOLLOW_UP_DAYS = 2
export const followUpDate = () => new Date(Date.now() + FOLLOW_UP_DAYS * 24 * 60 * 60 * 1000)

export async function leadsCollection() {
  return (await getDb()).collection('leads')
}

const empty = (value) => value === undefined || value === null || value === ''

export const leadValidators = {
  service: oneOf('A service', SERVICES, { required: true }),
  package: text('The package', { max: 100 }),
  // Calendar day as YYYY-MM-DD: an event date has no time or time zone.
  eventDate(value) {
    if (empty(value)) return null
    const valid = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
    if (!valid) throw new HttpError(400, 'The event date is not valid.')
    return value
  },
  guests(value) {
    if (empty(value)) return null
    if (!Number.isInteger(value) || value < 1 || value > 100000) throw new HttpError(400, 'The number of guests must be a whole number.')
    return value
  },
  details: text('The details', { max: 3000 }),
  source: oneOf('Where the enquiry came from', SOURCES, { required: true }),
  status: oneOf('A status', STATUSES, { required: true }),
  lostReason: oneOf('The reason', LOST_REASONS),
  followUpAt(value) {
    if (empty(value)) return null
    const date = new Date(value)
    if (typeof value !== 'string' || Number.isNaN(date.getTime())) throw new HttpError(400, 'The follow-up date is not valid.')
    return date
  },
}

// `customer` is the owner of the lead (may be missing if it was deleted mid-request).
export function toLead(doc, customer) {
  return {
    id: String(doc._id),
    customerId: String(doc.customerId),
    customer: customer ? { id: String(customer._id), name: customer.name, phone: customer.phone } : null,
    service: doc.service,
    package: doc.package ?? null,
    eventDate: doc.eventDate ?? null,
    guests: doc.guests ?? null,
    details: doc.details ?? '',
    source: doc.source,
    status: doc.status,
    lostReason: doc.lostReason ?? null,
    followUpAt: doc.followUpAt ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

// Builds a new lead document from cleaned fields. Empty optional fields are left out.
export function newLead(customerId, fields, source) {
  const now = new Date()
  const doc = { customerId, service: fields.service, details: fields.details ?? '', source, status: 'new', createdAt: now, updatedAt: now }
  for (const key of ['package', 'eventDate', 'guests']) if (fields[key] !== null && fields[key] !== undefined) doc[key] = fields[key]
  return doc
}

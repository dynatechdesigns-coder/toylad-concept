import { normalisePhone } from './customers.js'
import { getDb } from './db.js'
import { HttpError } from './http.js'
import { boolean, text } from './validate.js'

export async function feedbackCollection() {
  return (await getDb()).collection('feedback')
}

export const feedbackValidators = {
  name: text('Your name', { max: 80, required: true }),
  // Optional: an empty phone is fine, a filled one must be a real number.
  phone(value) {
    if (value === undefined || value === null || String(value).trim() === '') return null
    return normalisePhone(value)
  },
  rating(value) {
    if (!Number.isInteger(value) || value < 1 || value > 5) throw new HttpError(400, 'Please choose a rating from 1 to 5 stars.')
    return value
  },
  comment: text('Your comment', { max: 600 }),
  canPublish: boolean('canPublish'),
}

// Everything, for the owner.
export function toFeedback(doc) {
  return {
    id: String(doc._id),
    customerId: doc.customerId ? String(doc.customerId) : null,
    orderId: doc.orderId ? String(doc.orderId) : null,
    name: doc.name,
    phone: doc.phone ?? null,
    rating: doc.rating,
    comment: doc.comment ?? '',
    occasion: doc.occasion ?? null,
    canPublish: doc.canPublish === true,
    approved: doc.approved === true,
    createdAt: doc.createdAt,
  }
}

// "Kemi Adeyemi" -> "Kemi A." so a published review never shows a full name. Couples ("Ada & Tunde") stay as typed.
function publicName(name) {
  const words = name.trim().split(/\s+/)
  if (words.length < 2 || /&|\band\b/i.test(name)) return name.trim()
  return `${words[0]} ${words.at(-1)[0].toUpperCase()}.`
}

// Only what the website shows: no phone, no ids that link to a customer or order.
export function toReview(doc) {
  return { id: String(doc._id), name: publicName(doc.name), rating: doc.rating, comment: doc.comment, occasion: doc.occasion ?? null, createdAt: doc.createdAt }
}

// A review can go on the website only with the customer's permission, the owner's approval, and some words to show.
export const publishedFilter = { canPublish: true, approved: true, comment: { $nin: [null, ''] } }

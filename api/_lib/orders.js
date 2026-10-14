import { getDb } from './db.js'
import { HttpError } from './http.js'
import { oneOf, text } from './validate.js'

// Keep in sync with src/data/orders.js.
const CATEGORIES = ['cakes', 'pastries', 'decor', 'planning', 'academy', 'other']
const STATUSES = ['confirmed', 'delivered', 'cancelled']
const MAX_ITEMS = 30

export async function ordersCollection() {
  return (await getDb()).collection('orders')
}

// Today's date in Nigeria (UTC+1, no daylight saving) as YYYY-MM-DD.
export function todayInNigeria() {
  return new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 10)
}

const empty = (value) => value === undefined || value === null || value === ''

function day(label, { required = false } = {}) {
  return (value) => {
    if (empty(value)) {
      if (required) throw new HttpError(400, `Please choose ${label}.`)
      return null
    }
    const valid = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
    if (!valid) throw new HttpError(400, `${label[0].toUpperCase()}${label.slice(1)} is not a valid date.`)
    return value
  }
}

// An amount in naira: zero or more, at most two decimal places kept.
function money(label, { required = false } = {}) {
  return (value) => {
    if (empty(value)) {
      if (required) throw new HttpError(400, `Please enter ${label}.`)
      return null
    }
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1e10) {
      throw new HttpError(400, `${label[0].toUpperCase()}${label.slice(1)} must be a number, 0 or more.`)
    }
    return Math.round(value * 100) / 100
  }
}

const itemName = text('The item name', { max: 100, required: true })
const itemCategory = oneOf('A category for each item', CATEGORIES, { required: true })

export const orderValidators = {
  items(value) {
    if (!Array.isArray(value) || value.length === 0) throw new HttpError(400, 'Please add at least one item.')
    if (value.length > MAX_ITEMS) throw new HttpError(400, `An order can have at most ${MAX_ITEMS} items.`)
    return value.map((item) => {
      const { name, category, quantity } = item && typeof item === 'object' ? item : {}
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100000) {
        throw new HttpError(400, 'Each item needs a quantity of 1 or more.')
      }
      return { name: itemName(name), category: itemCategory(category), quantity }
    })
  },
  amount: money('the amount', { required: true }),
  deposit: money('the deposit'),
  orderDate: day('the order date'),
  deliveryDate: day('the delivery date', { required: true }),
  status: oneOf('A status', STATUSES, { required: true }),
  occasion: text('The occasion', { max: 60 }),
  notes: text('Notes', { max: 2000 }),
}

// `customer` is missing once a customer has been deleted: the order stays for the sales records.
export function toOrder(doc, customer) {
  return {
    id: String(doc._id),
    customerId: doc.customerId ? String(doc.customerId) : null,
    customer: customer ? { id: String(customer._id), name: customer.name, phone: customer.phone } : null,
    leadId: doc.leadId ? String(doc.leadId) : null,
    items: doc.items,
    amount: doc.amount,
    deposit: doc.deposit ?? null,
    orderDate: doc.orderDate,
    deliveryDate: doc.deliveryDate,
    status: doc.status,
    deliveredAt: doc.deliveredAt ?? null,
    occasion: doc.occasion ?? null,
    notes: doc.notes ?? '',
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export function checkDeposit(amount, deposit) {
  if (deposit !== null && deposit !== undefined && deposit > amount) {
    throw new HttpError(400, 'The deposit cannot be more than the amount.')
  }
}

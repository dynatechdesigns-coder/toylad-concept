import { getDb } from './db.js'
import { todayInNigeria } from './orders.js'

// Celebrations are shown from today up to this many days ahead (today counts as day 1).
const WINDOW_DAYS = 7

// One record per celebration she has marked "Done": { key, year, customerId, sentAt }.
export async function sentCollection() {
  return (await getDb()).collection('celebrationsSent')
}

export function addDays(day, count) {
  const date = new Date(`${day}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + count)
  return date.toISOString().slice(0, 10)
}

const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

// The date among `days` on which { day, month } falls, or null. 29 February is kept on the 28th in other years.
function occurrence(days, { day, month }) {
  return (
    days.find((date) => {
      const [year, m, d] = date.split('-').map(Number)
      const target = month === 2 && day === 29 && !isLeapYear(year) ? 28 : day
      return m === month && d === target
    }) ?? null
  )
}

// Occasions in the coming week for customers who agreed to offers, leaving out the ones already marked done
// for that year. `kind` is "birthday", "anniversary" (both from the customer record) or "event"
// (a whole number of years since an order was delivered for an occasion).
export function buildCelebrations({ customers, orders, sent, today = todayInNigeria(), windowDays = WINDOW_DAYS }) {
  const days = Array.from({ length: windowDays }, (_, index) => addDays(today, index))
  const done = new Set(sent.map((mark) => `${mark.key}:${mark.year}`))
  const consenting = new Map(customers.filter((customer) => customer.marketingConsent === true).map((customer) => [String(customer._id), customer]))
  const list = []

  const add = (customer, date, details) => {
    const year = Number(date.slice(0, 4))
    if (done.has(`${details.key}:${year}`)) return
    list.push({ ...details, year, date, daysAway: days.indexOf(date), customer: { id: String(customer._id), name: customer.name, phone: customer.phone } })
  }

  for (const customer of consenting.values()) {
    for (const kind of ['birthday', 'anniversary']) {
      const date = customer[kind] ? occurrence(days, customer[kind]) : null
      if (date) add(customer, date, { key: `${kind}:${customer._id}`, kind })
    }
  }

  for (const order of orders) {
    const customer = order.customerId ? consenting.get(String(order.customerId)) : null
    if (!customer || order.status !== 'delivered' || !order.occasion) continue
    const [year, month, day] = order.deliveryDate.split('-').map(Number)
    const date = occurrence(days, { day, month })
    const years = date ? Number(date.slice(0, 4)) - year : 0
    if (years >= 1) add(customer, date, { key: `event:${order._id}`, kind: 'event', years, occasion: order.occasion, item: order.items[0]?.name ?? '' })
  }

  return list.sort((a, b) => a.daysAway - b.daysAway || a.customer.name.localeCompare(b.customer.name))
}

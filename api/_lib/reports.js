import { todayInNigeria } from './orders.js'

const LOYAL_ORDERS = 3
const QUIET_MONTHS = 6
const TOP_ITEMS = 8

// "2026-10-14" minus n months -> "2026-04-14" (clamped to a real day is not needed for comparisons).
function monthsBefore(day, months) {
  const [year, month] = day.split('-').map(Number)
  const total = year * 12 + (month - 1) - months
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}${day.slice(7)}`
}

// How often each category and item was ordered: `orders` = how many orders included it, `quantity` = units.
function topSellers(orders) {
  const categories = new Map()
  const items = new Map()
  for (const order of orders) {
    const seenCategories = new Set()
    const seenItems = new Set()
    for (const item of order.items) {
      const category = categories.get(item.category) ?? { id: item.category, orders: 0, quantity: 0 }
      category.quantity += item.quantity
      if (!seenCategories.has(item.category)) category.orders += 1
      seenCategories.add(item.category)
      categories.set(item.category, category)

      // "Vanilla Cake" and "vanilla cake " count as the same item.
      const key = item.name.trim().toLowerCase()
      const entry = items.get(key) ?? { name: item.name.trim(), orders: 0, quantity: 0 }
      entry.quantity += item.quantity
      if (!seenItems.has(key)) entry.orders += 1
      seenItems.add(key)
      items.set(key, entry)
    }
  }
  const ranked = (map) => [...map.values()].sort((a, b) => b.orders - a.orders || b.quantity - a.quantity)
  return { categories: ranked(categories), items: ranked(items).slice(0, TOP_ITEMS) }
}

// Everything the Reports screen shows, worked out from the three collections.
// Cancelled orders never count. Sales and "this month" go by order date; busy months go by delivery date.
export function buildReports({ orders, customers, leads }) {
  const today = todayInNigeria()
  const thisMonth = today.slice(0, 7)
  const thisYear = today.slice(0, 4)
  const real = orders.filter((order) => order.status !== 'cancelled')
  const inMonth = real.filter((order) => order.orderDate.startsWith(thisMonth))

  const month = {
    label: thisMonth,
    orders: inMonth.length,
    sales: inMonth.reduce((sum, order) => sum + order.amount, 0),
    // Customer dates are stored in UTC; shift to Nigerian time before comparing months.
    newCustomers: customers.filter((customer) => new Date(customer.createdAt.getTime() + 3600000).toISOString().startsWith(thisMonth)).length,
  }

  const busyMonths = Array.from({ length: 12 }, (_, index) => {
    const label = monthsBefore(today, 11 - index).slice(0, 7)
    return { month: label, orders: real.filter((order) => order.deliveryDate.startsWith(label)).length }
  })

  // Per-customer totals for the two customer lists.
  const totals = new Map()
  for (const order of real) {
    if (!order.customerId) continue
    const key = String(order.customerId)
    const entry = totals.get(key) ?? { orders: 0, spent: 0, lastOrderDate: '' }
    entry.orders += 1
    entry.spent += order.amount
    if (order.orderDate > entry.lastOrderDate) entry.lastOrderDate = order.orderDate
    totals.set(key, entry)
  }
  const withTotals = customers
    .filter((customer) => totals.has(String(customer._id)))
    .map((customer) => ({
      id: String(customer._id),
      name: customer.name,
      phone: customer.phone,
      marketingConsent: customer.marketingConsent === true,
      ...totals.get(String(customer._id)),
    }))
  const quietBefore = monthsBefore(today, QUIET_MONTHS)

  const lost = new Map()
  for (const lead of leads) if (lead.status === 'lost') lost.set(lead.lostReason ?? 'other', (lost.get(lead.lostReason ?? 'other') ?? 0) + 1)

  return {
    month,
    topSellers: {
      month: topSellers(inMonth),
      year: topSellers(real.filter((order) => order.orderDate.startsWith(thisYear))),
      all: topSellers(real),
    },
    busyMonths,
    loyal: withTotals.filter((customer) => customer.orders >= LOYAL_ORDERS).sort((a, b) => b.orders - a.orders || b.spent - a.spent),
    quiet: withTotals.filter((customer) => customer.lastOrderDate < quietBefore).sort((a, b) => a.lastOrderDate.localeCompare(b.lastOrderDate)),
    lostReasons: [...lost.entries()].map(([id, count]) => ({ id, count })).sort((a, b) => b.count - a.count),
  }
}

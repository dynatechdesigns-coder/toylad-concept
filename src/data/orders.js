import site from './site'

// Keep the ids in sync with api/_lib/orders.js.
export const orderCategories = [
  { id: 'cakes', label: 'Cakes' },
  { id: 'pastries', label: 'Pastries' },
  { id: 'decor', label: 'Event decor' },
  { id: 'planning', label: 'Event planning' },
  { id: 'academy', label: 'Academy classes' },
  { id: 'other', label: 'Other' },
]

export const orderStatuses = [
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
]

// Suggestions offered while typing the occasion. She can type anything else.
export const occasions = ['Wedding', 'Birthday', 'Anniversary', 'Baby shower', 'Corporate event', 'Graduation', 'Naming ceremony']

// The order category that matches each booking-form service, to pre-fill an order made from a prospect.
export const categoryForService = { cake: 'cakes', pastries: 'pastries', 'event-decoration': 'decor', 'event-management': 'planning' }

// Report settings shown in the screen's wording. The server applies the same numbers (api/_lib/reports.js).
export const LOYAL_ORDERS = 3
export const QUIET_MONTHS = 6

export const sellerPeriods = [
  { id: 'month', label: 'This month' },
  { id: 'year', label: 'This year' },
  { id: 'all', label: 'All time' },
]

// Sent only to customers who agreed to receive offers. She can edit it in WhatsApp before sending.
export function weMissYouMessage(name) {
  return `Hello ${name.split(' ')[0]}! It has been a while and we miss you at ${site.name}. We would love to make something special for your next celebration. Just reply here whenever you are ready.`
}

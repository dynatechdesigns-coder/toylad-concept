import { serviceOptions } from '../data/booking'
import { FOLLOW_UP_DAYS, leadSources, leadStatuses, lostReasons } from '../data/crm'

const DAY = 24 * 60 * 60 * 1000
const labelIn = (list) => (id) => list.find((item) => (item.id ?? item.value) === id)?.label ?? id

export const serviceLabel = labelIn(serviceOptions)
export const statusLabel = labelIn(leadStatuses)
export const sourceLabel = labelIn(leadSources)
export const lostReasonLabel = labelIn(lostReasons)

// "5 minutes ago", "yesterday", "3 days ago", "2 weeks ago"…
export function timeAgo(date, now = Date.now()) {
  const minutes = Math.max(0, Math.round((now - new Date(date).getTime()) / 60000))
  const plural = (count, unit) => `${count} ${unit}${count === 1 ? '' : 's'} ago`
  if (minutes < 1) return 'just now'
  if (minutes < 60) return plural(minutes, 'minute')
  if (minutes < 60 * 24) return plural(Math.round(minutes / 60), 'hour')
  const days = Math.round(minutes / (60 * 24))
  if (days === 1) return 'yesterday'
  if (days < 14) return plural(days, 'day')
  if (days < 60) return plural(Math.round(days / 7), 'week')
  return plural(Math.round(days / 30), 'month')
}

// "2027-01-15" -> "Friday 15 January 2027"
export function formatDay(day) {
  if (!day) return ''
  return new Date(`${String(day).slice(0, 10)}T00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

// A lead needs a follow-up when it is still open and two days have passed since it came in,
// or since the follow-up date set when she last got in touch.
export function isFollowUpDue(lead, now = Date.now()) {
  if (!['new', 'quoted'].includes(lead.status)) return false
  if (lead.followUpAt) return new Date(lead.followUpAt).getTime() <= now
  return now - new Date(lead.createdAt).getTime() >= FOLLOW_UP_DAYS * DAY
}

// 45000 -> "₦45,000"
export function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString('en-NG', { maximumFractionDigits: 2 })}`
}

// "2026-10" -> "Oct 2026" (or "October 2026" with style "long")
export function monthLabel(month, style = 'short') {
  return new Date(`${month}-01T00:00`).toLocaleDateString('en-GB', { month: style, year: 'numeric' })
}

// "2026-10-14" plus 6 days -> "2026-10-20"
export function daysFrom(day, count) {
  const date = new Date(`${day}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + count)
  return date.toISOString().slice(0, 10)
}

export const nextFollowUp = () => new Date(Date.now() + FOLLOW_UP_DAYS * DAY).toISOString()

// "+2348161556766" -> "0816 155 6766". Numbers from other countries are shown as they are.
export function displayPhone(phone) {
  const local = /^\+234(\d{3})(\d{3})(\d{4})$/.exec(phone ?? '')
  return local ? `0${local[1]} ${local[2]} ${local[3]}` : (phone ?? '')
}

export function whatsappTo(phone, message = '') {
  return `https://wa.me/${String(phone).replace(/\D/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

// Matches a customer by part of their name or phone number (typed with or without the leading 0 or +234).
export function matchesCustomer(customer, query) {
  const words = query.trim().toLowerCase()
  if (!words) return true
  if (customer.name.toLowerCase().includes(words)) return true
  const digits = words.replace(/\D/g, '').replace(/^(234|0)/, '')
  return digits.length >= 3 && customer.phone.replace(/\D/g, '').includes(digits)
}

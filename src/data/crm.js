import site from './site'

// Keep the ids in sync with api/_lib/leads.js.
export const leadStatuses = [
  { id: 'new', label: 'New', hint: 'Just asked. No quote sent yet.' },
  { id: 'quoted', label: 'Quoted', hint: 'You sent a price. Waiting for an answer.' },
  { id: 'confirmed', label: 'Confirmed', hint: 'They said yes. The order is booked.' },
  { id: 'delivered', label: 'Delivered', hint: 'The order is done.' },
  { id: 'lost', label: 'Lost', hint: 'They are not going ahead.' },
]

export const lostReasons = [
  { id: 'price', label: 'Price was too high' },
  { id: 'date unavailable', label: 'Date was not available' },
  { id: 'went elsewhere', label: 'Went to someone else' },
  { id: 'no response', label: 'Stopped replying' },
  { id: 'other', label: 'Another reason' },
]

// `manual` sources are the ones the owner can pick when she records an enquiry herself.
export const leadSources = [
  { id: 'website', label: 'Website form' },
  { id: 'whatsapp', label: 'WhatsApp', manual: true },
  { id: 'phone', label: 'Phone call', manual: true },
  { id: 'walk-in', label: 'Walk-in', manual: true },
]

// A lead still "new" or "quoted" this many days after it came in (or after her last follow-up) needs a follow-up.
export const FOLLOW_UP_DAYS = 2

// Starting text for a follow-up on WhatsApp. She can edit it before sending.
export function followUpMessage({ name, service }) {
  const firstName = name.split(' ')[0]
  return `Hello ${firstName}! This is ${site.name}. I am following up on your ${service.toLowerCase()} enquiry. Would you still like us to help? I am happy to answer any questions.`
}

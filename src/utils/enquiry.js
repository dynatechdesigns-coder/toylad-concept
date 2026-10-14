import { displayValue, visibleFields } from './booking'
import { toDayMonth } from './dayMonth'

// Form fields saved as their own columns. Every other filled field is added to the details text.
const ownColumns = ['name', 'phone', 'email', 'service', 'package', 'date', 'guests', 'details']

// What the booking form sends to /api/enquiries. `extras` holds the fields that are not part of the WhatsApp message.
export function buildEnquiry(values, extras) {
  const fields = visibleFields(values)
  const filled = (name) => values[name]?.trim() ?? ''
  const extraLines = fields
    .filter((field) => !ownColumns.includes(field.name) && filled(field.name))
    .map((field) => `${field.label}: ${displayValue(field, values)}`)
  const packageField = fields.find((field) => field.name === 'package')

  const enquiry = {
    name: filled('name'),
    phone: filled('phone'),
    service: values.service,
    details: [filled('details'), ...extraLines].filter(Boolean).join('\n'),
    marketingConsent: extras.consent,
    website: extras.website,
  }
  if (filled('email')) enquiry.email = filled('email')
  if (packageField && filled('package')) enquiry.package = displayValue(packageField, values)
  if (filled('date')) enquiry.eventDate = values.date
  if (/^\d+$/.test(filled('guests'))) enquiry.guests = Number(values.guests)
  if (toDayMonth(extras.birthday)) enquiry.birthday = toDayMonth(extras.birthday)
  if (toDayMonth(extras.anniversary)) enquiry.anniversary = toDayMonth(extras.anniversary)
  return enquiry
}

// Saves a copy of the enquiry in the background. It must never get in the customer's way,
// so every failure is ignored: the WhatsApp message is what actually reaches the shop.
export function saveEnquiry(values, extras) {
  try {
    fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildEnquiry(values, extras)),
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Ignored on purpose.
  }
}

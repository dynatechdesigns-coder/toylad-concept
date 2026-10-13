import { bookingFields, packageOptionsFor } from '../data/booking'
import site from '../data/site'

export const emptyBooking = Object.fromEntries(bookingFields.map((field) => [field.name, '']))

export function optionsFor(field, values) {
  const options = field.name === 'package' ? packageOptionsFor(values.service) : (field.options ?? [])
  return options.map((option) => (typeof option === 'string' ? { value: option, label: option } : option))
}

// Fields that apply to the currently selected service, in display order.
export function visibleFields(values) {
  return bookingFields.filter((field) => {
    if (field.showFor && !field.showFor.includes(values.service)) return false
    if (field.name === 'package') return packageOptionsFor(values.service).length > 0
    return true
  })
}

// Today's date as YYYY-MM-DD in the visitor's local time zone.
export function todayISO() {
  const now = new Date()
  const pad = (number) => String(number).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function validateField(field, rawValue) {
  const value = rawValue.trim()
  if (!value) return field.required || ''

  switch (field.name) {
    case 'name':
      return value.length < 2 ? 'Please enter your full name.' : ''
    case 'phone':
      return /^\+?[\d\s()-]{7,20}$/.test(value) ? '' : 'Please enter a valid phone number, e.g. 0801 234 5678.'
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address.'
    case 'date':
      return value < todayISO() ? 'Event date cannot be in the past.' : ''
    case 'guests':
      return /^\d+$/.test(value) && Number(value) >= 1 ? '' : 'Please enter a whole number of guests.'
    case 'details':
      return value.length < 10 ? 'Please add a little more detail (at least 10 characters).' : ''
    default:
      return ''
  }
}

// Returns { fieldName: message } for every visible field that fails validation.
export function validateBooking(values) {
  const errors = {}
  visibleFields(values).forEach((field) => {
    const message = validateField(field, values[field.name])
    if (message) errors[field.name] = message
  })
  return errors
}

function displayValue(field, values) {
  const value = values[field.name].trim()
  if (field.type === 'select') {
    return optionsFor(field, values).find((option) => option.value === value)?.label ?? value
  }
  if (field.type === 'date') {
    return new Date(`${value}T00:00`).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }
  return value
}

// One line per filled field. `bold` wraps labels in WhatsApp's *bold* markers.
export function buildBookingMessage(values, { bold = true } = {}) {
  const mark = bold ? '*' : ''
  const lines = visibleFields(values)
    .filter((field) => values[field.name].trim())
    .map((field) => {
      const separator = field.type === 'textarea' ? '\n' : ' '
      return `${mark}${field.label}:${mark}${separator}${displayValue(field, values)}`
    })
  return [`${mark}New enquiry for ${site.name}${mark}`, '', ...lines].join('\n')
}

// Null while no email address is set, so callers can hide their email links.
export function bookingMailto(values) {
  if (!site.email) return null
  const subject = encodeURIComponent(`Enquiry from ${values.name.trim() || 'the website'}`)
  const body = encodeURIComponent(buildBookingMessage(values, { bold: false }))
  return `mailto:${site.email}?subject=${subject}&body=${body}`
}

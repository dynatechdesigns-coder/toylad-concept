import { ObjectId } from 'mongodb'
import { HttpError } from './http.js'

// The `:id` part of a URL, as a MongoDB id.
export function objectId(value) {
  if (typeof value !== 'string' || !/^[0-9a-f]{24}$/i.test(value)) throw new HttpError(400, 'That id is not valid.')
  return new ObjectId(value)
}

// Runs `validators[key]` over each allowed key of `body` and returns the cleaned values.
// Unknown keys are rejected; `required` keys must be present. A validator may return null to mean "clear this".
export function pickFields(body, validators, { allowed, required = [] }) {
  const unknown = Object.keys(body).find((key) => !allowed.includes(key))
  if (unknown) throw new HttpError(400, `Unknown field "${unknown}".`)

  const fields = {}
  for (const key of allowed) {
    if (body[key] === undefined) {
      if (required.includes(key)) validators[key](undefined)
      continue
    }
    fields[key] = validators[key](body[key])
  }
  return fields
}

// Splits cleaned fields into a MongoDB update: null values are removed from the document.
export function toUpdate(fields, extra = {}) {
  const $set = { ...extra }
  const $unset = {}
  for (const [key, value] of Object.entries(fields)) {
    if (value === null) $unset[key] = ''
    else $set[key] = value
  }
  return { ...(Object.keys($set).length > 0 && { $set }), ...(Object.keys($unset).length > 0 && { $unset }) }
}

const empty = (value) => value === undefined || value === null || value === ''

// Trimmed text. Optional text returns null when empty.
export function text(label, { max, required = false }) {
  return (value) => {
    const clean = typeof value === 'string' ? value.trim() : ''
    if (!empty(value) && typeof value !== 'string') throw new HttpError(400, `${label} must be text.`)
    if (!clean) {
      if (required) throw new HttpError(400, `Please enter ${label.toLowerCase()}.`)
      return null
    }
    if (clean.length > max) throw new HttpError(400, `${label} is too long. Keep it under ${max} characters.`)
    return clean
  }
}

export function oneOf(label, options, { required = false } = {}) {
  return (value) => {
    if (empty(value)) {
      if (required) throw new HttpError(400, `Please choose ${label.toLowerCase()}.`)
      return null
    }
    if (!options.includes(value)) throw new HttpError(400, `${label} is not one of the allowed choices.`)
    return value
  }
}

export function boolean(label) {
  return (value) => {
    if (typeof value !== 'boolean') throw new HttpError(400, `"${label}" must be true or false.`)
    return value
  }
}

const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

// { day, month } with no year, e.g. a birthday. Empty clears it.
export function dayMonth(label) {
  return (value) => {
    if (empty(value)) return null
    const { day, month } = typeof value === 'object' ? value : {}
    if (empty(day) && empty(month)) return null
    const valid = Number.isInteger(day) && Number.isInteger(month) && month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1]
    if (!valid) throw new HttpError(400, `${label} is not a real day and month.`)
    return { day, month }
  }
}

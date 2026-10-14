import months from '../data/months'

// Form state { day: '3', month: '11' } -> { day: 3, month: 11 } for the API, or null unless both are chosen.
export function toDayMonth(value) {
  return value?.day && value?.month ? { day: Number(value.day), month: Number(value.month) } : null
}

// API value -> form state.
export function fromDayMonth(value) {
  return value ? { day: String(value.day), month: String(value.month) } : { day: '', month: '' }
}

// { day: 3, month: 11 } -> "3 November"
export function formatDayMonth(value) {
  if (!value) return ''
  return `${value.day} ${months.find((month) => month.number === value.month)?.name ?? ''}`
}

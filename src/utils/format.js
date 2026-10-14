import site from '../data/site'

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function whatsappUrl(message) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export function mapsUrl(address) {
  // Addresses are written as sentences; the search works better without the final full stop.
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.replace(/\.$/, ''))}`
}

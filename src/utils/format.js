import site from '../data/site'

export function formatPrice(amount) {
  return `${site.currency}${amount.toLocaleString('en-NG')}`
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function whatsappUrl(message) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`
}

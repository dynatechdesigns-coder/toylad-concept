// Shared look for admin inputs and selects. Tall enough to tap comfortably on a phone.
export function controlClass(error) {
  return `block min-h-14 w-full rounded-2xl border bg-cream px-4 py-3 text-lg text-espresso transition duration-300 ease-out placeholder:text-espresso/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal motion-reduce:transition-none ${
    error ? 'border-terracotta-deep' : 'border-espresso/20'
  }`
}

// Secondary actions on photo cards and dialogs.
export const actionButton =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-espresso/20 px-4 text-base font-semibold text-espresso transition duration-300 ease-out hover:border-teal hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none'

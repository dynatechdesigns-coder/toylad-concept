import { galleryCategories } from '../data/gallery'

// "All" never shows more than this many photos.
export const ALL_LIMIT = 10
// Each category shows at most this many photos on the website.
export const CATEGORY_LIMIT = 8

const newestFirst = (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)

// The owner's photos that actually show: the first CATEGORY_LIMIT of each category, in her order.
// `photos` must already be in her order and contain only published photos.
export function limitPerCategory(photos) {
  const seen = {}
  return photos.filter((photo) => {
    seen[photo.category] = (seen[photo.category] ?? 0) + 1
    return seen[photo.category] <= CATEGORY_LIMIT
  })
}

// `uploaded` is the owner's published photos in her chosen order; `stock` is the placeholder set.
// Returns the photos for the "All" tab and for each category tab.
export function buildGallery(uploaded, stock, showStock) {
  const shown = limitPerCategory(uploaded)
  const filler = showStock ? stock : []

  // Each category: her photos first, then stock photos fill any empty spots.
  const byCategory = Object.fromEntries(
    galleryCategories.map(({ id }) => [
      id,
      [...shown, ...filler].filter((item) => item.category === id).slice(0, CATEGORY_LIMIT),
    ]),
  )

  // All: her starred photos in her order, then her newest, then the stock photos still on show.
  const featured = shown.filter((item) => item.featured)
  const newest = shown.filter((item) => !item.featured).sort(newestFirst)
  const stockOnShow = filler.filter((item) => byCategory[item.category]?.includes(item))
  const all = [...featured, ...newest, ...stockOnShow].slice(0, ALL_LIMIT)

  return { all, byCategory }
}

import { galleryCategories } from '../data/gallery'

// "All" never shows more than this many photos.
export const ALL_LIMIT = 10
// Category tabs show this many photos at first, and this many more per "Show more".
export const PAGE_SIZE = 12
// Once the owner has this many photos of her own, the stock photos stop showing.
export const OWN_PHOTOS_TARGET = 10

const newestFirst = (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)

// `uploaded` is the owner's published photos in her chosen order; `stock` is the placeholder set.
// Returns the photos for the "All" tab and for each category tab.
export function buildGallery(uploaded, stock, showStock) {
  const filler = showStock && uploaded.length < OWN_PHOTOS_TARGET ? stock : []

  // All: her starred photos in her order, then her newest, then stock photos while she has few.
  const featured = uploaded.filter((item) => item.featured)
  const newest = uploaded.filter((item) => !item.featured).sort(newestFirst)
  const all = [...featured, ...newest, ...filler].slice(0, ALL_LIMIT)

  const byCategory = Object.fromEntries(
    galleryCategories.map(({ id }) => [id, [...uploaded, ...filler].filter((item) => item.category === id)]),
  )
  return { all, byCategory }
}

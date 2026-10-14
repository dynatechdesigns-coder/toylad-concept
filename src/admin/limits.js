import { galleryCategories } from '../data/gallery'
import { CATEGORY_LIMIT } from '../utils/gallery'

const labels = Object.fromEntries(galleryCategories.map((category) => [category.id, category.label]))

// Shown when a photo is saved but its category already has its full set on the website.
export function limitNote(category) {
  return `Only the first ${CATEGORY_LIMIT} ${labels[category] ?? ''} photos show on the website. Move this photo up, or hide an older one, to show it.`
}

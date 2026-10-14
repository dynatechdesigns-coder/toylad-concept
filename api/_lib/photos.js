import { ObjectId } from 'mongodb'
import { getDb } from './db.js'
import { HttpError } from './http.js'

// Keep in sync with galleryCategories in src/data/gallery.js.
const CATEGORIES = ['cakes', 'pastries', 'decor', 'planning']

// Display order everywhere: lowest `order` first, then newest.
export const photoSort = { order: 1, createdAt: -1 }

export async function photosCollection() {
  return (await getDb()).collection('photos')
}

export function toPublicPhoto(doc) {
  return {
    id: String(doc._id),
    title: doc.title,
    category: doc.category,
    imageUrl: doc.imageUrl,
    width: doc.width,
    height: doc.height,
    featured: doc.featured === true,
    createdAt: doc.createdAt,
  }
}

export function toAdminPhoto(doc) {
  return { ...toPublicPhoto(doc), published: doc.published, order: doc.order }
}

export function parsePhotoId(value) {
  if (typeof value !== 'string' || !/^[0-9a-f]{24}$/i.test(value)) throw new HttpError(400, 'That photo id is not valid.')
  return new ObjectId(value)
}

const validators = {
  title(value) {
    const title = typeof value === 'string' ? value.trim() : ''
    if (!title) throw new HttpError(400, 'Please give the photo a title.')
    if (title.length > 80) throw new HttpError(400, 'The title is too long. Keep it under 80 characters.')
    return title
  },
  category(value) {
    if (!CATEGORIES.includes(value)) throw new HttpError(400, 'Please choose a category.')
    return value
  },
  published(value) {
    if (typeof value !== 'boolean') throw new HttpError(400, '"published" must be true or false.')
    return value
  },
  featured(value) {
    if (typeof value !== 'boolean') throw new HttpError(400, '"featured" must be true or false.')
    return value
  },
  order(value) {
    if (!Number.isSafeInteger(value)) throw new HttpError(400, '"order" must be a whole number.')
    return value
  },
}

// Returns only the known, valid fields. `required` lists fields that must be present.
export function validatePhotoFields(body, { allowed, required = [] }) {
  const unknown = Object.keys(body).find((key) => !allowed.includes(key))
  if (unknown) throw new HttpError(400, `Unknown field "${unknown}".`)

  const fields = {}
  for (const key of allowed) {
    if (!(key in validators)) continue
    if (body[key] === undefined) {
      if (required.includes(key)) validators[key](undefined)
      continue
    }
    fields[key] = validators[key](body[key])
  }
  return fields
}

import { getCloudinary } from '../../_lib/cloudinary.js'
import { HttpError, readJson, route } from '../../_lib/http.js'
import { parsePhotoId, photosCollection, toAdminPhoto, validatePhotoFields } from '../../_lib/photos.js'

const notFound = () => new HttpError(404, 'That photo no longer exists.')

export default route(
  {
    async PATCH(req) {
      const _id = parsePhotoId(req.query.id)
      const fields = validatePhotoFields(readJson(req), { allowed: ['title', 'category', 'published', 'order'] })
      if (Object.keys(fields).length === 0) throw new HttpError(400, 'Nothing to change.')

      const photos = await photosCollection()
      const doc = await photos.findOneAndUpdate(
        { _id },
        { $set: { ...fields, updatedAt: new Date() } },
        { returnDocument: 'after' },
      )
      if (!doc) throw notFound()
      return { photo: toAdminPhoto(doc) }
    },

    async DELETE(req) {
      const _id = parsePhotoId(req.query.id)
      const photos = await photosCollection()
      const doc = await photos.findOne({ _id })
      if (!doc) throw notFound()

      // Cloudinary first: if it fails the record stays, so the owner can simply try again.
      try {
        const { result } = await getCloudinary().uploader.destroy(doc.publicId, { invalidate: true })
        if (result !== 'ok' && result !== 'not found') throw new Error(`Cloudinary destroy returned "${result}"`)
      } catch (error) {
        if (error instanceof HttpError) throw error
        console.error(error)
        throw new HttpError(502, 'Could not delete the photo. Please try again.')
      }

      await photos.deleteOne({ _id })
      return { deleted: true }
    },
  },
  { auth: true },
)

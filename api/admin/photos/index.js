import { getCloudinary } from '../../_lib/cloudinary.js'
import { HttpError, readJson, route } from '../../_lib/http.js'
import { photoSort, photosCollection, toAdminPhoto, validatePhotoFields } from '../../_lib/photos.js'

// Looks the upload up in Cloudinary so the URL and size come from there, not from the browser.
async function findUpload(publicId) {
  if (typeof publicId !== 'string' || !publicId || publicId.length > 200) {
    throw new HttpError(400, 'The uploaded photo is missing. Please upload it again.')
  }
  try {
    return await getCloudinary().api.resource(publicId)
  } catch (error) {
    if (error instanceof HttpError) throw error
    if ((error?.error?.http_code ?? error?.http_code) === 404) {
      throw new HttpError(400, 'We could not find that photo. Please upload it again.')
    }
    console.error(error)
    throw new HttpError(502, 'Photo storage did not answer. Please try again.')
  }
}

export default route(
  {
    async GET() {
      const photos = await photosCollection()
      const docs = await photos.find({}).sort(photoSort).toArray()
      return { photos: docs.map(toAdminPhoto) }
    },

    async POST(req, res) {
      const body = readJson(req)
      const fields = validatePhotoFields(body, {
        allowed: ['title', 'category', 'published', 'featured', 'publicId'],
        required: ['title', 'category'],
      })
      const upload = await findUpload(body.publicId)

      const photos = await photosCollection()
      if (await photos.findOne({ publicId: upload.public_id })) {
        throw new HttpError(409, 'That photo has already been added.')
      }
      // New photos go to the front: one place before the current first photo.
      const [first] = await photos.find({}).sort({ order: 1 }).limit(1).toArray()
      const now = new Date()
      const doc = {
        published: true,
        featured: false,
        ...fields,
        imageUrl: upload.secure_url,
        publicId: upload.public_id,
        width: upload.width,
        height: upload.height,
        order: first ? first.order - 1 : 0,
        createdAt: now,
        updatedAt: now,
      }
      const { insertedId } = await photos.insertOne(doc)
      res.statusCode = 201
      return { photo: toAdminPhoto({ ...doc, _id: insertedId }) }
    },
  },
  { auth: true },
)

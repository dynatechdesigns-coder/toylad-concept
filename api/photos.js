import { route } from './_lib/http.js'
import { photoSort, photosCollection, toPublicPhoto } from './_lib/photos.js'

// Public: the photos the owner has published, in display order.
export default route({
  async GET() {
    const photos = await photosCollection()
    const docs = await photos.find({ published: true }).sort(photoSort).toArray()
    return { photos: docs.map(toPublicPhoto) }
  },
})

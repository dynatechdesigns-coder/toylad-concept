import { GALLERY_FOLDER, getCloudinary } from '../_lib/cloudinary.js'
import { route } from '../_lib/http.js'

// Signs one direct browser-to-Cloudinary upload. The API secret never leaves the server.
export default route(
  {
    POST() {
      const cloudinary = getCloudinary()
      const timestamp = Math.round(Date.now() / 1000)
      const signature = cloudinary.utils.api_sign_request(
        { folder: GALLERY_FOLDER, timestamp },
        process.env.CLOUDINARY_API_SECRET,
      )
      return {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder: GALLERY_FOLDER,
        timestamp,
        signature,
      }
    },
  },
  { auth: true },
)

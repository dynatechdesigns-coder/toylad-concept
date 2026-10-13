import resizeImage from './resizeImage'

const offline = 'Could not connect. Check your internet and try again.'
const uploadFailed = 'Upload failed. Check your internet and try again.'

// `status` is the HTTP status (0 = no connection). 401 means the session has ended.
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, { method = 'GET', body } = {}) {
  let response
  try {
    response = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(offline, 0)
  }
  const data = await response.json().catch(() => null)
  if (!response.ok || !data) {
    throw new ApiError(data?.error ?? 'Something went wrong. Please try again.', response.status)
  }
  return data
}

export const getSession = () => request('/api/auth/me')
export const login = (password) => request('/api/auth/login', { method: 'POST', body: { password } })
export const logout = () => request('/api/auth/logout', { method: 'POST' })
export const listPhotos = () => request('/api/admin/photos')
export const updatePhoto = (id, changes) => request(`/api/admin/photos/${id}`, { method: 'PATCH', body: changes })
export const deletePhoto = (id) => request(`/api/admin/photos/${id}`, { method: 'DELETE' })

// XMLHttpRequest rather than fetch, because fetch cannot report upload progress.
function sendToCloudinary(file, signed, onProgress) {
  return new Promise((resolve, reject) => {
    const form = new FormData()
    form.append('file', file)
    form.append('api_key', signed.apiKey)
    form.append('timestamp', signed.timestamp)
    form.append('folder', signed.folder)
    form.append('signature', signed.signature)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100))
    }
    xhr.onload = () => {
      let data = null
      try {
        data = JSON.parse(xhr.responseText)
      } catch {
        // Handled below as a failed upload.
      }
      if (xhr.status === 200 && data?.public_id) resolve(data)
      else reject(new ApiError(uploadFailed, xhr.status))
    }
    xhr.onerror = () => reject(new ApiError(uploadFailed, 0))
    xhr.send(form)
  })
}

// Uploads straight to Cloudinary with a signature from our API, then saves the photo record.
export async function uploadPhoto({ file, title, category }, onProgress) {
  const signed = await request('/api/admin/upload-signature', { method: 'POST' })
  const upload = await sendToCloudinary(await resizeImage(file), signed, onProgress)
  const { photo } = await request('/api/admin/photos', {
    method: 'POST',
    body: { title, category, publicId: upload.public_id },
  })
  return photo
}

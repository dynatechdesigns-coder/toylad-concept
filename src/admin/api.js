import resizeImage from './resizeImage'

const offline = 'Could not connect. Check your internet and try again.'
const uploadFailed = 'Upload failed. Check your internet and try again.'

// The three steps of publishing a photo, used to say which one failed.
const steps = {
  signature: 'Step 1 of 3 failed: getting permission to upload.',
  upload: 'Step 2 of 3 failed: sending the photo to photo storage.',
  save: 'Step 3 of 3 failed: saving the photo to the database.',
}

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
    throw new ApiError(data?.error ?? `The website did not answer properly (error ${response.status}).`, response.status)
  }
  return data
}

export const getSession = () => request('/api/auth/me')
export const login = (password) => request('/api/auth/login', { method: 'POST', body: { password } })
export const logout = () => request('/api/auth/logout', { method: 'POST' })
export const listPhotos = () => request('/api/admin/photos')
export const updatePhoto = (id, changes) => request(`/api/admin/photos/${id}`, { method: 'PATCH', body: changes })
export const deletePhoto = (id) => request(`/api/admin/photos/${id}`, { method: 'DELETE' })
export const getHealth = () => request('/api/admin/tools/health')

export const listLeads = () => request('/api/admin/leads')
export const createLead = (enquiry) => request('/api/admin/leads', { method: 'POST', body: enquiry })
export const updateLead = (id, changes) => request(`/api/admin/leads?id=${id}`, { method: 'PATCH', body: changes })
export const listCustomers = () => request('/api/admin/customers')
export const getCustomer = (id) => request(`/api/admin/customers?id=${id}`)
export const updateCustomer = (id, changes) => request(`/api/admin/customers?id=${id}`, { method: 'PATCH', body: changes })
export const deleteCustomer = (id) => request(`/api/admin/customers?id=${id}`, { method: 'DELETE' })
export const listOrders = () => request('/api/admin/orders')
export const createOrder = (order) => request('/api/admin/orders', { method: 'POST', body: order })
export const updateOrder = (id, changes) => request(`/api/admin/orders?id=${id}`, { method: 'PATCH', body: changes })
export const getReports = () => request('/api/admin/tools/reports')
export const listFeedback = () => request('/api/admin/tools/feedback')
export const showFeedback = (id, approved) => request('/api/admin/tools/feedback', { method: 'POST', body: { id, approved } })
export const deleteFeedback = (id) => request(`/api/admin/tools/feedback?id=${id}`, { method: 'DELETE' })
export const getCelebrations = () => request('/api/admin/tools/celebrations')
export const markCelebrationDone = (key, year) => request('/api/admin/tools/celebrations', { method: 'POST', body: { key, year } })

// Runs one upload step; on failure the message says which step it was. 401 passes through untouched.
async function inStep(step, action) {
  try {
    return await action()
  } catch (problem) {
    if (problem.status === 401) throw problem
    throw new ApiError(`${steps[step]} ${problem.message}`, problem.status)
  }
}

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
      else if (data?.error?.message) reject(new ApiError(`Photo storage said: “${data.error.message}”`, 502))
      else reject(new ApiError(uploadFailed, 502))
    }
    xhr.onerror = () => reject(new ApiError(uploadFailed, 0))
    xhr.send(form)
  })
}

// Uploads straight to Cloudinary with a signature from our API, then saves the photo record.
export async function uploadPhoto({ file, title, category }, onProgress) {
  const signed = await inStep('signature', () => request('/api/admin/tools/upload-signature', { method: 'POST' }))
  const upload = await inStep('upload', async () => sendToCloudinary(await resizeImage(file), signed, onProgress))
  const { photo } = await inStep('save', () =>
    request('/api/admin/photos', { method: 'POST', body: { title, category, publicId: upload.public_id } }),
  )
  return photo
}

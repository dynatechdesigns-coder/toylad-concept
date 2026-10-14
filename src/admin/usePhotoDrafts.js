import { useRef, useState } from 'react'
import { uploadPhoto } from './api'

const successMessage = (count) =>
  count === 1 ? 'Your photo is now on the website.' : `Your ${count} photos are now on the website.`

// Photos the owner has picked but not yet published. Each draft has its own title and category.
export default function usePhotoDrafts({ onUploaded, onSessionExpired, onProblem }) {
  const [drafts, setDrafts] = useState([])
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState('')
  const nextId = useRef(1)

  const patch = (id, changes) =>
    setDrafts((current) => current.map((draft) => (draft.id === id ? { ...draft, ...changes } : draft)))

  const addFiles = (files) => {
    const picked = [...files]
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        id: nextId.current++,
        file,
        previewUrl: URL.createObjectURL(file),
        title: '',
        category: '',
        errors: {},
        progress: null,
        failure: '',
      }))
    if (picked.length === 0) return
    setMessage('')
    setDrafts((current) => [...current, ...picked])
  }

  const remove = (id) =>
    setDrafts((current) => {
      const draft = current.find((item) => item.id === id)
      if (draft) URL.revokeObjectURL(draft.previewUrl)
      return current.filter((item) => item.id !== id)
    })

  const change = (id, name, value) =>
    setDrafts((current) =>
      current.map((draft) =>
        draft.id === id ? { ...draft, [name]: value, errors: { ...draft.errors, [name]: '' } } : draft,
      ),
    )

  const publish = async () => {
    const checked = drafts.map((draft) => ({
      ...draft,
      failure: '',
      errors: {
        title: draft.title.trim() ? '' : 'Please give this photo a title.',
        category: draft.category ? '' : 'Please choose a category.',
      },
    }))
    setDrafts(checked)
    setMessage('')
    if (checked.some((draft) => draft.errors.title || draft.errors.category)) return

    setPublishing(true)
    let published = 0
    for (const draft of checked) {
      patch(draft.id, { progress: 0 })
      try {
        const photo = await uploadPhoto(
          { file: draft.file, title: draft.title.trim(), category: draft.category },
          (progress) => patch(draft.id, { progress }),
        )
        onUploaded(photo)
        remove(draft.id)
        published += 1
      } catch (problem) {
        if (problem.status === 401) {
          onSessionExpired()
          break
        }
        patch(draft.id, { progress: null, failure: problem.message })
        onProblem()
      }
    }
    setPublishing(false)
    if (published > 0) setMessage(successMessage(published))
  }

  return { drafts, publishing, message, addFiles, remove, change, publish }
}

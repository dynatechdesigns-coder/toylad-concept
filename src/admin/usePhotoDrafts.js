import { useRef, useState } from 'react'
import { uploadPhoto } from './api'
import { limitNote } from './limits'

const successMessage = (count) =>
  count === 1 ? 'Your photo is now on the website.' : `Your ${count} photos are now on the website.`

// Photos the owner has picked but not yet published. Each draft has its own title and category.
export default function usePhotoDrafts({ onUploaded, onSessionExpired, onProblem }) {
  const [drafts, setDrafts] = useState([])
  const [publishing, setPublishing] = useState(false)
  // Lines of the message shown after publishing: successes, then any "over the limit" notes.
  const [message, setMessage] = useState([])
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
    setMessage([])
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
    setMessage([])
    if (checked.some((draft) => draft.errors.title || draft.errors.category)) return

    setPublishing(true)
    let published = 0
    let savedOnly = 0
    const notes = new Set()
    for (const draft of checked) {
      patch(draft.id, { progress: 0 })
      try {
        const photo = await uploadPhoto(
          { file: draft.file, title: draft.title.trim(), category: draft.category },
          (progress) => patch(draft.id, { progress }),
        )
        // `overLimit`: the photo is saved, but its category already shows its full set.
        if (onUploaded(photo)?.overLimit) {
          savedOnly += 1
          notes.add(limitNote(photo.category))
        } else {
          published += 1
        }
        remove(draft.id)
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
    setMessage([
      ...(published > 0 ? [successMessage(published)] : []),
      ...(savedOnly > 0 ? [savedOnly === 1 ? 'Your photo is saved.' : `Your ${savedOnly} photos are saved.`, ...notes] : []),
    ])
  }

  return { drafts, publishing, message, addFiles, remove, change, publish }
}

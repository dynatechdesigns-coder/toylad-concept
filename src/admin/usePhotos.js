import { useEffect, useState } from 'react'
import { deletePhoto, listPhotos, updatePhoto } from './api'

// The owner's photos in website order, plus the actions the Photos screen needs.
export default function usePhotos(onSessionExpired) {
  const [photos, setPhotos] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const fail = (problem) => {
    if (problem.status === 401) onSessionExpired()
    else setError(problem.message)
  }

  const load = () =>
    listPhotos()
      .then((data) => setPhotos(data.photos))
      .catch((problem) => {
        setPhotos((current) => current ?? [])
        fail(problem)
      })

  useEffect(() => {
    // Runs once: the list is loaded when the screen opens.
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const run = async (action) => {
    setBusy(true)
    setError('')
    try {
      await action()
      return true
    } catch (problem) {
      fail(problem)
      return false
    } finally {
      setBusy(false)
    }
  }

  const add = (photo) => setPhotos((current) => [photo, ...(current ?? [])])

  const update = (id, changes) =>
    run(async () => {
      const { photo } = await updatePhoto(id, changes)
      setPhotos((current) => current.map((item) => (item.id === id ? photo : item)))
    })

  const remove = (id) =>
    run(async () => {
      await deletePhoto(id)
      setPhotos((current) => current.filter((item) => item.id !== id))
    })

  // Swaps the photo with its neighbour, then saves every position that changed.
  const move = (id, offset) =>
    run(async () => {
      const from = photos.findIndex((item) => item.id === id)
      const to = from + offset
      if (from < 0 || to < 0 || to >= photos.length) return

      const reordered = [...photos]
      ;[reordered[from], reordered[to]] = [reordered[to], reordered[from]]
      const changed = reordered.filter((item, index) => item.order !== index)
      setPhotos(reordered.map((item, index) => ({ ...item, order: index })))
      try {
        await Promise.all(changed.map((item) => updatePhoto(item.id, { order: reordered.indexOf(item) })))
      } catch (problem) {
        await load()
        throw problem
      }
    })

  return { photos, error, busy, add, update, remove, move }
}

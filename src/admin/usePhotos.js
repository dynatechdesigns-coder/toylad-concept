import { useEffect, useRef, useState } from 'react'
import { CATEGORY_LIMIT } from '../utils/gallery'
import { deletePhoto, listPhotos, updatePhoto } from './api'

// The owner's photos in website order, plus the actions to change them.
// `onChanged` (optional) runs after every saved change, e.g. to refresh the public gallery.
export default function usePhotos({ onSessionExpired, onProblem, onChanged }) {
  const [photos, setPhotos] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  // Always the latest list, so several uploads in a row each see the ones before them.
  const latest = useRef(null)

  const setList = (next) => {
    latest.current = next
    setPhotos(next)
  }

  const fail = (problem) => {
    if (problem.status === 401) return onSessionExpired()
    setError(problem.message)
    onProblem()
  }

  const load = () =>
    listPhotos()
      .then((data) => setList(data.photos))
      .catch((problem) => {
        setList(latest.current ?? [])
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
      onChanged?.()
      return true
    } catch (problem) {
      fail(problem)
      return false
    } finally {
      setBusy(false)
    }
  }

  // New photos join the end of the list. `overLimit` says its category was already full on the website.
  const add = (photo) => {
    const list = latest.current ?? []
    const showing = list.filter((item) => item.published && item.category === photo.category).length
    setList([...list, photo])
    onChanged?.()
    return { overLimit: photo.published && showing >= CATEGORY_LIMIT }
  }

  const update = (id, changes) =>
    run(async () => {
      const { photo } = await updatePhoto(id, changes)
      setList(latest.current.map((item) => (item.id === id ? photo : item)))
    })

  const remove = (id) =>
    run(async () => {
      await deletePhoto(id)
      setList(latest.current.filter((item) => item.id !== id))
    })

  // Swaps the photo with the next one of the same category, then saves every position that changed.
  const move = (id, offset) =>
    run(async () => {
      const list = latest.current
      const from = list.findIndex((item) => item.id === id)
      if (from < 0) return
      let to = from + offset
      while (list[to] && list[to].category !== list[from].category) to += offset
      if (!list[to]) return

      const reordered = [...list]
      ;[reordered[from], reordered[to]] = [reordered[to], reordered[from]]
      const changed = reordered.map((item, order) => ({ id: item.id, order })).filter(({ order }, index) => reordered[index].order !== order)
      setList(reordered.map((item, order) => ({ ...item, order })))
      try {
        await Promise.all(changed.map(({ id: photoId, order }) => updatePhoto(photoId, { order })))
      } catch (problem) {
        await load()
        throw problem
      }
    })

  return { photos, error, busy, add, update, remove, move }
}

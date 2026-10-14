import { useCallback, useEffect, useState } from 'react'
import { galleryCategories } from '../data/gallery'
import { cloudinarySrcSet, cloudinaryUrl } from '../utils/cloudinary'

const categoryIds = galleryCategories.map((category) => category.id)

function toGalleryItem(photo) {
  return {
    id: `photo-${photo.id}`,
    photoId: photo.id,
    title: photo.title,
    category: photo.category,
    featured: photo.featured === true,
    createdAt: photo.createdAt,
    image: cloudinaryUrl(photo.imageUrl, 800),
    srcSet: cloudinarySrcSet(photo.imageUrl),
  }
}

// The owner's published photos as gallery items, in her order. Stays empty if the API is missing or fails.
// `reload` fetches them again (used after the owner changes something).
export default function useUploadedPhotos() {
  const [items, setItems] = useState([])

  const reload = useCallback(
    () =>
      fetch('/api/photos')
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          if (!Array.isArray(data?.photos)) return
          const valid = data.photos.filter(
            (photo) => typeof photo.imageUrl === 'string' && categoryIds.includes(photo.category),
          )
          setItems(valid.map(toGalleryItem))
        })
        .catch(() => {}),
    [],
  )

  useEffect(() => {
    reload()
  }, [reload])

  return { items, reload }
}

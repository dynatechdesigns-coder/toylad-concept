import { useEffect, useState } from 'react'
import { galleryCategories } from '../data/gallery'
import { cloudinarySrcSet, cloudinaryUrl } from '../utils/cloudinary'

const categoryIds = galleryCategories.map((category) => category.id)

function toGalleryItem(photo) {
  return {
    id: `photo-${photo.id}`,
    title: photo.title,
    category: photo.category,
    image: cloudinaryUrl(photo.imageUrl, 800),
    srcSet: cloudinarySrcSet(photo.imageUrl),
  }
}

// The owner's published photos as gallery items. Stays empty if the API is missing or fails.
export default function useUploadedPhotos() {
  const [items, setItems] = useState([])

  useEffect(() => {
    let active = true
    fetch('/api/photos')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!active || !Array.isArray(data?.photos)) return
        const valid = data.photos.filter(
          (photo) => typeof photo.imageUrl === 'string' && categoryIds.includes(photo.category),
        )
        setItems(valid.map(toGalleryItem))
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return items
}

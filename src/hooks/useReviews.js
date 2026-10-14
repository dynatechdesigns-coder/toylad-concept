import { useEffect, useState } from 'react'

// Approved customer reviews for the Testimonials section, newest first.
// Stays empty if the API is missing or fails, and the section then hides itself.
export default function useReviews() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    let active = true
    fetch('/api/feedback')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!active || !Array.isArray(data?.reviews)) return
        setReviews(data.reviews.filter((review) => review.comment && review.name))
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return reviews
}

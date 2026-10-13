import { useEffect, useState } from 'react'

// True while the element with this id is on screen. With `once`, stays true after the first time.
export default function useSectionInView(id, { once = false, threshold = 0 } = {}) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = document.getElementById(id)
    if (!element) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) observer.disconnect()
      },
      { threshold },
    )
    observer.observe(element)

    return () => observer.disconnect()
  }, [id, once, threshold])

  return inView
}

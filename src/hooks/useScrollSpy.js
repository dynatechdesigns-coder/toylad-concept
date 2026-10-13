import { useEffect, useState } from 'react'

// Returns the id of the section currently in the reading band of the viewport
// (45%–85% of its height), or null when none is. `ids` must be a stable array.
export default function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    const visible = new Set()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        })
        setActiveId(ids.find((id) => visible.has(id)) ?? null)
      },
      { rootMargin: '-45% 0px -15% 0px' },
    )

    ids.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [ids])

  return activeId
}

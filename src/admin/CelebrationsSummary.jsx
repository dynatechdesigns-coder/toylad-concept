import { useEffect, useState } from 'react'
import { PartyPopper } from 'lucide-react'
import { CELEBRATION_DAYS } from '../data/celebrations'
import { getCelebrations } from './api'

// A small banner on the admin home: how many celebrations are coming, with a button to open the tab.
// It stays hidden while loading, when there are none, or if the request fails.
export default function CelebrationsSummary({ onOpen }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    getCelebrations()
      .then((data) => setItems(data.celebrations))
      .catch(() => {})
  }, [])

  if (items.length === 0) return null
  const today = items.filter((item) => item.daysAway === 0).length

  return (
    <aside aria-label="Celebrations" className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-3xl bg-butter-soft p-4">
      <p className="flex min-w-0 flex-1 items-center gap-3 text-base font-semibold text-espresso md:text-lg">
        <PartyPopper className="size-6 shrink-0 text-terracotta-deep" aria-hidden="true" />
        <span>
          {items.length} {items.length === 1 ? 'celebration' : 'celebrations'} in the next {CELEBRATION_DAYS} days
          {today > 0 && `, ${today} today`}
        </span>
      </p>
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-terracotta-deep px-6 text-base font-semibold text-white shadow-sm transition duration-300 ease-out hover:bg-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-butter-soft motion-reduce:transition-none"
      >
        Send wishes
      </button>
    </aside>
  )
}

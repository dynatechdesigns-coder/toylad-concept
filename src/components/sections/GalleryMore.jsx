import { galleryCategories } from '../../data/gallery'
import Button from '../ui/Button'

// Under the "All" grid: buttons that jump to each category tab.
export default function GalleryMore({ filter, empty, onJump }) {
  if (empty) return <p className="mt-8 text-center text-base text-espresso/75">New photos are coming soon.</p>
  if (filter !== 'all') return null

  return (
    <div className="mt-4 text-center md:mt-6">
      <p className="text-base font-medium text-espresso/80 md:text-lg">See more in each category</p>
      <ul className="mt-4 flex flex-wrap justify-center gap-3">
        {galleryCategories.map((category) => (
          <li key={category.id}>
            <Button variant="outline" size="sm" className="min-h-11" onClick={() => onJump(category.id)}>
              {category.label}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

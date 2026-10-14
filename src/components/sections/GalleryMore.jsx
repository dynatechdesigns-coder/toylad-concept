import { galleryCategories } from '../../data/gallery'
import Button from '../ui/Button'

// Under the grid: links to the category tabs (on "All"), or "Show more" (on a category tab).
export default function GalleryMore({ filter, empty, remaining, onShowMore, onJump }) {
  if (empty) return <p className="mt-8 text-center text-base text-espresso/75">New photos are coming soon.</p>

  if (filter === 'all') {
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

  if (remaining <= 0) return null
  return (
    <div className="mt-4 flex justify-center md:mt-6">
      <Button variant="outline" className="min-h-12" onClick={onShowMore}>
        Show more
      </Button>
    </div>
  )
}

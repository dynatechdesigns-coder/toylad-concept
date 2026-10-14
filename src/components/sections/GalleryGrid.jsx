import GalleryCard from './GalleryCard'

// Cycled by position to give the columns a masonry feel.
const aspects = ['4 / 5', '1 / 1', '3 / 4', '4 / 3', '1 / 1']

// `actionsFor(photoId)` is only passed in owner mode: it returns the owner's buttons for an uploaded photo.
export default function GalleryGrid({ filter, items, categoryById, onOpen, actionsFor }) {
  return (
    <div
      key={filter}
      id="gallery-panel"
      role="tabpanel"
      aria-labelledby={`gallery-tab-${filter}`}
      className="mt-8 columns-2 gap-6 md:mt-10 md:columns-3 md:gap-8 lg:columns-4"
    >
      {items.map((item, index) => (
        <div key={item.id} className="mb-6 break-inside-avoid md:mb-8">
          <GalleryCard
            item={item}
            categoryLabel={categoryById[item.category].label}
            aspect={aspects[index % aspects.length]}
            onOpen={() => onOpen(item.id)}
          />
          {item.photoId && actionsFor?.(item.photoId)}
        </div>
      ))}
    </div>
  )
}

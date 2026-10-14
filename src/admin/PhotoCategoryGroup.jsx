import { CATEGORY_LIMIT } from '../utils/gallery'
import PhotoCard from './PhotoCard'

// One category of the owner's photos: how many show on the website, then her photos in order.
export default function PhotoCategoryGroup({ category, photos, busy, actions }) {
  const visible = photos.filter((photo) => photo.published)
  const showing = visible.slice(0, CATEGORY_LIMIT)
  const headingId = `photos-${category.id}`

  return (
    <section aria-labelledby={headingId} className="mt-10">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h3 id={headingId} className="text-xl font-semibold md:text-2xl">
          {category.label}
        </h3>
        <p className="rounded-full bg-butter px-3 py-1 text-sm font-semibold text-espresso">
          {showing.length} of {CATEGORY_LIMIT} showing on website
        </p>
      </div>

      {visible.length > CATEGORY_LIMIT && (
        <p className="mt-3 rounded-3xl bg-butter-soft p-4 text-base text-espresso">
          Only the first {CATEGORY_LIMIT} {category.label} photos show on the website. Move a photo up, or hide an older
          one, to show it. The extra photos stay saved.
        </p>
      )}
      {photos.length === 0 && <p className="mt-3 text-base text-espresso/75">No {category.label} photos yet.</p>}

      {photos.length > 0 && (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              categoryLabel={category.label}
              overLimit={photo.published && !showing.includes(photo)}
              isFirst={index === 0}
              isLast={index === photos.length - 1}
              busy={busy}
              onFeature={() => actions.feature(photo)}
              onToggle={() => actions.toggle(photo)}
              onEdit={() => actions.edit(photo)}
              onMove={(offset) => actions.move(photo, offset)}
              onDelete={() => actions.remove(photo)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

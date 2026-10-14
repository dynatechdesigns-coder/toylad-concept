import { useState } from 'react'
import { Star } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import { galleryCategories } from '../data/gallery'
import { ALL_LIMIT } from '../utils/gallery'
import HealthPanel from './HealthPanel'
import PhotoCard from './PhotoCard'
import PhotoDialogs from './PhotoDialogs'
import PhotoUploader from './PhotoUploader'
import usePhotos from './usePhotos'

const categoryLabels = Object.fromEntries(galleryCategories.map((category) => [category.id, category.label]))

export default function AdminPhotos({ onSessionExpired }) {
  // Counts errors: each one shows the connection check again with fresh results.
  const [problems, setProblems] = useState(0)
  const onProblem = () => setProblems((count) => count + 1)
  const { photos, error, busy, add, update, remove, move } = usePhotos({ onSessionExpired, onProblem })
  // { type: 'edit' | 'delete', photo } while a dialog is open.
  const [dialog, setDialog] = useState(null)

  return (
    <>
      <SectionHeading
        align="left"
        eyebrow="Owner area"
        title="Your gallery photos"
        subtitle="Add new photos here. They appear on the website straight away."
      />

      <div className="mt-8">
        <PhotoUploader onUploaded={add} onSessionExpired={onSessionExpired} onProblem={onProblem} />
      </div>
      {problems > 0 && <HealthPanel key={problems} />}

      <section aria-labelledby="your-photos-title" className="mt-12 md:mt-16">
        <h2 id="your-photos-title" className="text-xl font-semibold md:text-2xl">
          Your photos
        </h2>
        <p className="mt-2 text-base leading-relaxed text-espresso/75 md:text-lg">
          The first photo here shows first on the website. Use Move up and Move down to change the order.
        </p>
        <p className="mt-4 flex items-start gap-3 rounded-3xl bg-butter-soft p-4 text-base text-espresso">
          <Star className="mt-0.5 size-5 shrink-0 fill-butter text-terracotta-deep" aria-hidden="true" />
          Up to {ALL_LIMIT} photos appear under “All”. Tap the star to choose which ones.
        </p>

        {error && (
          <p role="alert" className="mt-6 rounded-3xl border border-terracotta-deep bg-butter-soft p-4 text-lg font-medium text-espresso">
            {error}
          </p>
        )}

        {photos === null && <p className="mt-8 text-lg text-espresso/75">Loading your photos…</p>}
        {photos?.length === 0 && !error && (
          <p className="mt-8 rounded-3xl bg-butter-soft p-6 text-lg text-espresso">
            No photos yet. Tap “Add photo” above to put your first photo on the website.
          </p>
        )}

        {photos?.length > 0 && (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                categoryLabel={categoryLabels[photo.category] ?? photo.category}
                isFirst={index === 0}
                isLast={index === photos.length - 1}
                busy={busy}
                onFeature={() => update(photo.id, { featured: !photo.featured })}
                onToggle={() => update(photo.id, { published: !photo.published })}
                onEdit={() => setDialog({ type: 'edit', photo })}
                onMove={(offset) => move(photo.id, offset)}
                onDelete={() => setDialog({ type: 'delete', photo })}
              />
            ))}
          </ul>
        )}
      </section>

      <PhotoDialogs dialog={dialog} busy={busy} error={error} onUpdate={update} onRemove={remove} onClose={() => setDialog(null)} />
    </>
  )
}

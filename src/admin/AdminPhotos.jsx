import { useState } from 'react'
import { Star } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import { galleryCategories } from '../data/gallery'
import { ALL_LIMIT } from '../utils/gallery'
import HealthPanel from './HealthPanel'
import PhotoCategoryGroup from './PhotoCategoryGroup'
import PhotoDialogs from './PhotoDialogs'
import PhotoUploader from './PhotoUploader'
import usePhotos from './usePhotos'

export default function AdminPhotos({ onSessionExpired }) {
  // Counts errors: each one shows the connection check again with fresh results.
  const [problems, setProblems] = useState(0)
  const onProblem = () => setProblems((count) => count + 1)
  const { photos, error, busy, add, update, remove, move } = usePhotos({ onSessionExpired, onProblem })
  // { type: 'edit' | 'delete', photo } while a dialog is open.
  const [dialog, setDialog] = useState(null)

  const actions = {
    feature: (photo) => update(photo.id, { featured: !photo.featured }),
    toggle: (photo) => update(photo.id, { published: !photo.published }),
    edit: (photo) => setDialog({ type: 'edit', photo }),
    move: (photo, offset) => move(photo.id, offset),
    remove: (photo) => setDialog({ type: 'delete', photo }),
  }

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
        <h2 id="your-photos-title" className="text-3xl font-semibold">
          Your photos
        </h2>
        <p className="mt-2 text-base leading-relaxed text-espresso/75 md:text-lg">
          In each group, the first photo shows first on the website. Use Move up and Move down to change the order.
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

        {photos !== null &&
          galleryCategories.map((category) => (
            <PhotoCategoryGroup
              key={category.id}
              category={category}
              photos={photos.filter((photo) => photo.category === category.id)}
              busy={busy}
              actions={actions}
            />
          ))}
      </section>

      <PhotoDialogs dialog={dialog} busy={busy} error={error} onUpdate={update} onRemove={remove} onClose={() => setDialog(null)} />
    </>
  )
}

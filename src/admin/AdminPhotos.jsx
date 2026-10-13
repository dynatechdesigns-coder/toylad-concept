import { useState } from 'react'
import { galleryCategories } from '../data/gallery'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import PhotoCard from './PhotoCard'
import PhotoEditDialog from './PhotoEditDialog'
import PhotoUploader from './PhotoUploader'
import usePhotos from './usePhotos'

const categoryLabels = Object.fromEntries(galleryCategories.map((category) => [category.id, category.label]))

export default function AdminPhotos({ onSessionExpired }) {
  const { photos, error, busy, add, update, remove, move } = usePhotos(onSessionExpired)
  // { type: 'edit' | 'delete', photo } while a dialog is open.
  const [dialog, setDialog] = useState(null)

  const closeAfter = async (action) => {
    if (await action) setDialog(null)
  }

  return (
    <>
      <PhotoUploader onUploaded={add} onSessionExpired={onSessionExpired} />

      <section aria-labelledby="your-photos-title" className="mt-12">
        <h2 id="your-photos-title" className="text-3xl font-semibold">
          Your photos
        </h2>
        <p className="mt-2 text-base text-espresso/75 md:text-lg">
          The first photo here shows first on the website. Use Move up and Move down to change the order.
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
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                categoryLabel={categoryLabels[photo.category] ?? photo.category}
                isFirst={index === 0}
                isLast={index === photos.length - 1}
                busy={busy}
                onToggle={() => update(photo.id, { published: !photo.published })}
                onEdit={() => setDialog({ type: 'edit', photo })}
                onMove={(offset) => move(photo.id, offset)}
                onDelete={() => setDialog({ type: 'delete', photo })}
              />
            ))}
          </ul>
        )}
      </section>

      {dialog?.type === 'edit' && (
        <PhotoEditDialog
          photo={dialog.photo}
          busy={busy}
          error={error}
          onSave={(changes) => closeAfter(update(dialog.photo.id, changes))}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.type === 'delete' && (
        <ConfirmDeleteDialog
          photo={dialog.photo}
          busy={busy}
          error={error}
          onConfirm={() => closeAfter(remove(dialog.photo.id))}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  )
}

import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/ui/Button'
import { rememberOwner } from '../utils/ownerHint'
import Modal from '../components/ui/Modal'
import PhotoActions from './PhotoActions'
import PhotoDialogs from './PhotoDialogs'
import PhotoUploader from './PhotoUploader'
import usePhotos from './usePhotos'

const noop = () => {}

// Owner edit mode for the public gallery: an "Add photo" button plus buttons under each of her photos.
// `children(actionsFor)` renders the gallery; `onChanged` reloads it after every change.
export default function OwnerGalleryTools({ onChanged, onSignedOut, children }) {
  const onSessionExpired = () => {
    rememberOwner(false)
    onSignedOut()
  }
  const { photos, error, busy, add, update, remove } = usePhotos({ onSessionExpired, onProblem: noop, onChanged })
  // { type: 'upload' } or { type: 'edit' | 'delete', photo } while a dialog is open.
  const [dialog, setDialog] = useState(null)

  const actionsFor = (photoId) => {
    const photo = photos?.find((item) => item.id === photoId)
    if (!photo) return null
    return (
      <PhotoActions
        compact
        photo={photo}
        busy={busy}
        onFeature={() => update(photo.id, { featured: !photo.featured })}
        onToggle={() => update(photo.id, { published: !photo.published })}
        onEdit={() => setDialog({ type: 'edit', photo })}
        onDelete={() => setDialog({ type: 'delete', photo })}
      />
    )
  }

  return (
    <>
      <div className="mt-8 flex justify-center">
        <Button size="lg" icon={Plus} onClick={() => setDialog({ type: 'upload' })}>
          Add photo
        </Button>
      </div>
      {error && !dialog && (
        <p role="alert" className="mx-auto mt-4 max-w-xl rounded-3xl border border-terracotta-deep bg-butter-soft p-4 text-center text-base font-medium text-espresso">
          {error}
        </p>
      )}

      {children(actionsFor)}

      <PhotoDialogs dialog={dialog} busy={busy} error={error} onUpdate={update} onRemove={remove} onClose={() => setDialog(null)} />
      {dialog?.type === 'upload' && (
        <Modal title="Add photo" onClose={() => setDialog(null)}>
          <div className="mt-6">
            <PhotoUploader stacked onUploaded={add} onSessionExpired={onSessionExpired} onProblem={noop} />
          </div>
        </Modal>
      )}
    </>
  )
}

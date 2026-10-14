import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import PhotoEditDialog from './PhotoEditDialog'

// The edit and delete dialogs for `dialog = { type: 'edit' | 'delete', photo }`.
// `onUpdate` and `onRemove` resolve to true when the change was saved; the dialog then closes.
export default function PhotoDialogs({ dialog, busy, error, onUpdate, onRemove, onClose }) {
  const closeAfter = async (saved) => {
    if (await saved) onClose()
  }

  if (dialog?.type === 'edit') {
    return (
      <PhotoEditDialog
        photo={dialog.photo}
        busy={busy}
        error={error}
        onSave={(changes) => closeAfter(onUpdate(dialog.photo.id, changes))}
        onClose={onClose}
      />
    )
  }
  if (dialog?.type === 'delete') {
    return (
      <ConfirmDeleteDialog
        photo={dialog.photo}
        busy={busy}
        error={error}
        onConfirm={() => closeAfter(onRemove(dialog.photo.id))}
        onClose={onClose}
      />
    )
  }
  return null
}

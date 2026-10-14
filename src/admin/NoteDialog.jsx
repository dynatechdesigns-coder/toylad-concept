import { useState } from 'react'
import Modal from '../components/ui/Modal'
import AdminField from './AdminField'
import DialogActions from './DialogActions'
import { controlClass } from './fieldStyles'

// Adds a dated note to a customer's notes.
export default function NoteDialog({ customerName, busy, error, onSave, onClose }) {
  const [note, setNote] = useState('')
  const [noteError, setNoteError] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
    if (!note.trim()) {
      setNoteError('Please write the note first.')
      return
    }
    onSave(note.trim())
  }

  return (
    <Modal title={`Note about ${customerName}`} onClose={onClose}>
      <form onSubmit={onSubmit} noValidate className="mt-6">
        <AdminField id="customer-note" label="Note" error={noteError}>
          <textarea
            id="customer-note"
            rows={4}
            maxLength={1000}
            value={note}
            disabled={busy}
            placeholder="e.g. Wants a pink two-tier cake. Call back on Friday."
            aria-invalid={noteError ? true : undefined}
            aria-describedby={noteError ? 'customer-note-error' : undefined}
            onChange={(event) => {
              setNote(event.target.value)
              setNoteError('')
            }}
            className={controlClass(noteError)}
          />
        </AdminField>
        <p className="mt-2 text-sm text-espresso/75">Today’s date is added for you.</p>
        <DialogActions error={error} busy={busy} saveLabel="Save note" onCancel={onClose} />
      </form>
    </Modal>
  )
}

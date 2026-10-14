import { Trash2 } from 'lucide-react'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { actionButton } from './fieldStyles'

// `message` says exactly what will be deleted.
export default function ConfirmDeleteDialog({ message, busy, error, onConfirm, onClose }) {
  return (
    <Modal title="Are you sure?" onClose={onClose}>
      <p className="mt-3 break-words text-base leading-relaxed text-espresso/75 md:text-lg">{message}</p>
      {error && (
        <p role="alert" className="mt-4 rounded-2xl border border-terracotta-deep bg-butter-soft p-3 text-base font-medium text-espresso">
          {error}
        </p>
      )}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button size="lg" icon={Trash2} disabled={busy} onClick={onConfirm} className="w-full">
          {busy ? 'Deleting…' : 'Yes, delete'}
        </Button>
        <button type="button" onClick={onClose} className={`${actionButton} min-h-14 w-full`}>
          No, keep it
        </button>
      </div>
    </Modal>
  )
}

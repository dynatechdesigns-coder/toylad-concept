import { Trash2 } from 'lucide-react'
import Button from '../components/ui/Button'
import AdminDialog from './AdminDialog'
import { actionButton } from './fieldStyles'

export default function ConfirmDeleteDialog({ photo, busy, error, onConfirm, onClose }) {
  return (
    <AdminDialog title="Are you sure?" onClose={onClose}>
      <p className="mt-3 text-base leading-relaxed text-espresso/75 md:text-lg">
        “{photo.title}” will be deleted and removed from the website. You cannot undo this.
      </p>
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
    </AdminDialog>
  )
}

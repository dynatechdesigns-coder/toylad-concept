import Button from '../components/ui/Button'
import { actionButton } from './fieldStyles'

// The error line and the two buttons at the bottom of an admin dialog. The main button submits the form.
export default function DialogActions({ error, busy, saveLabel = 'Save', busyLabel = 'Saving…', cancelLabel = 'Cancel', onCancel }) {
  return (
    <>
      {error && (
        <p role="alert" className="mt-4 rounded-2xl border border-terracotta-deep bg-butter-soft p-3 text-base font-medium text-espresso">
          {error}
        </p>
      )}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button type="submit" size="lg" disabled={busy} className="w-full">
          {busy ? busyLabel : saveLabel}
        </Button>
        <button type="button" onClick={onCancel} className={`${actionButton} min-h-14 w-full`}>
          {cancelLabel}
        </button>
      </div>
    </>
  )
}

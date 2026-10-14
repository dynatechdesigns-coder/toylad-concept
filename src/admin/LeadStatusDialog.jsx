import { useState } from 'react'
import Modal from '../components/ui/Modal'
import { leadStatuses, lostReasons } from '../data/crm'
import AdminField from './AdminField'
import DialogActions from './DialogActions'
import { controlClass } from './fieldStyles'

// Pick a new status for an enquiry. Choosing "Lost" asks for the reason.
export default function LeadStatusDialog({ lead, busy, error, onSave, onClose }) {
  const [status, setStatus] = useState(lead.status)
  const [reason, setReason] = useState(lead.lostReason ?? '')
  const [reasonError, setReasonError] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
    if (status === 'lost' && !reason) {
      setReasonError('Please choose why it was lost.')
      return
    }
    onSave(status === 'lost' ? { status, lostReason: reason } : { status })
  }

  return (
    <Modal title={`Status for ${lead.customer?.name ?? 'this enquiry'}`} onClose={onClose}>
      <form onSubmit={onSubmit} noValidate className="mt-6">
        <fieldset disabled={busy} className="grid gap-2">
          <legend className="sr-only">Choose a status</legend>
          {leadStatuses.map((item) => (
            <label
              key={item.id}
              className="flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border border-espresso/20 px-4 py-2 transition duration-300 ease-out has-[:checked]:border-teal has-[:checked]:bg-butter-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal motion-reduce:transition-none"
            >
              <input
                type="radio"
                name="lead-status"
                value={item.id}
                checked={status === item.id}
                onChange={() => setStatus(item.id)}
                className="size-5 shrink-0 accent-teal focus-visible:outline-none"
              />
              <span>
                <span className="block text-base font-semibold">{item.label}</span>
                <span className="block text-sm text-espresso/75">{item.hint}</span>
              </span>
            </label>
          ))}
        </fieldset>

        {status === 'lost' && (
          <div className="mt-4">
            <AdminField id="lead-lost-reason" label="Why was it lost?" error={reasonError}>
              <select
                id="lead-lost-reason"
                value={reason}
                disabled={busy}
                aria-invalid={reasonError ? true : undefined}
                aria-describedby={reasonError ? 'lead-lost-reason-error' : undefined}
                onChange={(event) => {
                  setReason(event.target.value)
                  setReasonError('')
                }}
                className={controlClass(reasonError)}
              >
                <option value="">Choose a reason</option>
                {lostReasons.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </AdminField>
          </div>
        )}

        <DialogActions error={error} busy={busy} onCancel={onClose} />
      </form>
    </Modal>
  )
}

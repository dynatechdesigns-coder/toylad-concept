import { useEffect, useState } from 'react'
import { ArrowLeft, MessageCircle, NotebookPen, Pencil, Phone, Trash2 } from 'lucide-react'
import { formatDayMonth } from '../utils/dayMonth'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import CustomerEditDialog from './CustomerEditDialog'
import CustomerEnquiries from './CustomerEnquiries'
import NoteDialog from './NoteDialog'
import { deleteCustomer, getCustomer, updateCustomer } from './api'
import { displayPhone, formatDay, whatsappTo } from './crmFormat'
import { actionButton } from './fieldStyles'
import useAdminAction from './useAdminAction'

// One customer: details, consent, notes and all their enquiries. `onChanged` / `onDeleted` update the list behind it.
export default function CustomerDetail({ id, onBack, onChanged, onDeleted, onSessionExpired }) {
  const { run, busy, error, clearError } = useAdminAction(onSessionExpired)
  const [data, setData] = useState(null)
  // 'edit' | 'note' | 'delete' while a dialog is open.
  const [dialog, setDialog] = useState(null)

  useEffect(() => {
    run(() => getCustomer(id)).then((result) => result && setData(result))
    // Loads this customer when the screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const close = () => {
    setDialog(null)
    clearError()
  }
  const saveChanges = async (changes) => {
    const result = await run(() => updateCustomer(id, changes))
    if (!result) return
    setData((current) => ({ ...current, customer: result.customer }))
    onChanged(result.customer)
    close()
  }
  const remove = async () => {
    if (await run(() => deleteCustomer(id))) onDeleted(id)
  }

  const back = (
    <button type="button" onClick={onBack} className={actionButton}>
      <ArrowLeft className="size-5" aria-hidden="true" />
      All customers
    </button>
  )
  if (!data) {
    return (
      <>
        {back}
        <p role={error ? 'alert' : 'status'} className="mt-8 text-lg text-espresso/75">
          {error || 'Loading…'}
        </p>
      </>
    )
  }

  const { customer, leads } = data
  const facts = [
    ['Phone', displayPhone(customer.phone)],
    ['Email', customer.email || 'Not given'],
    ['Birthday', formatDayMonth(customer.birthday) || 'Not given'],
    ['Wedding anniversary', formatDayMonth(customer.anniversary) || 'Not given'],
    ['Offers on WhatsApp', customer.marketingConsent ? `Yes, agreed on ${formatDay(customer.consentDate)}` : 'No. Do not send offers.'],
    ['Customer since', formatDay(customer.createdAt)],
  ]

  return (
    <>
      {back}
      <h2 className="mt-6 break-words text-3xl font-semibold md:text-5xl">{customer.name}</h2>

      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <a href={`tel:${customer.phone}`} className={actionButton}>
          <Phone className="size-5" aria-hidden="true" />
          Call
        </a>
        <a href={whatsappTo(customer.phone)} target="_blank" rel="noopener noreferrer" className={actionButton}>
          <MessageCircle className="size-5" aria-hidden="true" />
          WhatsApp
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <button type="button" onClick={() => setDialog('edit')} className={actionButton}>
          <Pencil className="size-5" aria-hidden="true" />
          Edit details
        </button>
        <button type="button" onClick={() => setDialog('note')} className={actionButton}>
          <NotebookPen className="size-5" aria-hidden="true" />
          Add note
        </button>
      </div>

      <dl className="mt-8 grid gap-4 rounded-3xl bg-butter-soft p-4 sm:grid-cols-2 md:p-6">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="text-sm font-semibold text-navy">{label}</dt>
            <dd className="break-words text-lg">{value}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-10 text-xl font-semibold md:text-2xl">Notes</h3>
      <p className="mt-3 whitespace-pre-line break-words text-base md:text-lg">{customer.notes || 'No notes yet.'}</p>

      <h3 className="mt-10 text-xl font-semibold md:text-2xl">Enquiries</h3>
      <CustomerEnquiries leads={leads} />

      <h3 className="mt-10 text-xl font-semibold md:text-2xl">Delete this customer</h3>
      <p className="mt-2 text-base text-espresso/75">Use this when a customer asks you to remove their details.</p>
      <button type="button" onClick={() => setDialog('delete')} className={`${actionButton} mt-4`}>
        <Trash2 className="size-5 text-terracotta-deep" aria-hidden="true" />
        Delete customer
      </button>

      {dialog === 'edit' && <CustomerEditDialog customer={customer} busy={busy} error={error} onSave={saveChanges} onClose={close} />}
      {dialog === 'note' && <NoteDialog customerName={customer.name} busy={busy} error={error} onSave={(note) => saveChanges({ addNote: note })} onClose={close} />}
      {dialog === 'delete' && (
        <ConfirmDeleteDialog
          message={`${customer.name}, their details, their notes and their enquiries (${leads.length}) will be deleted for good. You cannot undo this.`}
          busy={busy}
          error={error}
          onConfirm={remove}
          onClose={close}
        />
      )}
    </>
  )
}

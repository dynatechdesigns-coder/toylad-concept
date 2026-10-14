import { BellRing, MessageCircle, NotebookPen, ReceiptText, RefreshCw } from 'lucide-react'
import { displayPhone, formatDay, isFollowUpDue, serviceLabel, sourceLabel, statusLabel, timeAgo } from './crmFormat'
import { actionButton } from './fieldStyles'

// One open enquiry: who, what, when, and what she can do with it.
export default function ProspectCard({ lead, busy, onStatus, onWhatsApp, onNote, onOrder }) {
  const due = isFollowUpDue(lead)
  const name = lead.customer?.name ?? 'Customer removed'

  return (
    <li className={`rounded-3xl border bg-cream p-4 shadow-sm md:p-6 ${due ? 'border-2 border-terracotta' : 'border-espresso/10'}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-butter px-3 py-1 text-sm font-semibold text-espresso">{statusLabel(lead.status)}</span>
        {due && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta-deep px-3 py-1 text-sm font-semibold text-white">
            <BellRing className="size-4" aria-hidden="true" />
            Follow up
          </span>
        )}
      </div>

      <h3 className="mt-3 break-words text-xl font-semibold">{name}</h3>
      {lead.customer && <p className="text-base text-espresso/75">{displayPhone(lead.customer.phone)}</p>}

      <dl className="mt-4 space-y-1 text-base">
        <div className="flex gap-2">
          <dt className="shrink-0 font-semibold">Wants:</dt>
          <dd className="min-w-0 break-words">
            {serviceLabel(lead.service)}
            {lead.package && ` (${lead.package})`}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 font-semibold">Event date:</dt>
          <dd>{lead.eventDate ? formatDay(lead.eventDate) : 'Not given'}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 font-semibold">Asked:</dt>
          <dd>
            {timeAgo(lead.createdAt)}, by {sourceLabel(lead.source).toLowerCase()}
          </dd>
        </div>
      </dl>
      {lead.details && <p className="mt-3 line-clamp-3 whitespace-pre-line break-words text-base text-espresso/75">{lead.details}</p>}

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button type="button" disabled={busy} onClick={onStatus} className={actionButton}>
          <RefreshCw className="size-5 shrink-0" aria-hidden="true" />
          Change status
        </button>
        <button type="button" disabled={busy || !lead.customer} onClick={onWhatsApp} className={actionButton}>
          <MessageCircle className="size-5 shrink-0" aria-hidden="true" />
          WhatsApp
        </button>
        <button type="button" disabled={busy || !lead.customer} onClick={onNote} className={actionButton}>
          <NotebookPen className="size-5 shrink-0" aria-hidden="true" />
          Add note
        </button>
        <button type="button" disabled={busy || !lead.customer} onClick={onOrder} className={actionButton}>
          <ReceiptText className="size-5 shrink-0" aria-hidden="true" />
          Create order
        </button>
      </div>
    </li>
  )
}

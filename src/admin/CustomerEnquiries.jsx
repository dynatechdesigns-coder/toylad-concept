import { formatDay, lostReasonLabel, serviceLabel, sourceLabel, statusLabel, timeAgo } from './crmFormat'

// Every enquiry one customer has made, newest first.
export default function CustomerEnquiries({ leads }) {
  if (leads.length === 0) return <p className="mt-3 text-base text-espresso/75">No enquiries on record.</p>

  return (
    <ul className="mt-4 grid gap-4">
      {leads.map((lead) => (
        <li key={lead.id} className="rounded-3xl border border-espresso/10 bg-cream p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-butter px-3 py-1 text-sm font-semibold text-espresso">{statusLabel(lead.status)}</span>
            {lead.lostReason && <span className="text-sm text-espresso/75">{lostReasonLabel(lead.lostReason)}</span>}
          </div>
          <h4 className="mt-3 font-sans text-lg font-semibold">
            {serviceLabel(lead.service)}
            {lead.package && ` (${lead.package})`}
          </h4>
          <p className="mt-1 text-base text-espresso/75">
            Asked {timeAgo(lead.createdAt)}, by {sourceLabel(lead.source).toLowerCase()}
            {lead.eventDate && `. Event: ${formatDay(lead.eventDate)}`}
            {lead.guests && `. Guests: ${lead.guests}`}
          </p>
          {lead.details && <p className="mt-2 whitespace-pre-line break-words text-base">{lead.details}</p>}
        </li>
      ))}
    </ul>
  )
}

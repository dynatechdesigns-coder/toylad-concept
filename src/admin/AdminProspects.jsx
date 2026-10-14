import { useEffect, useState } from 'react'
import { BellRing, Plus } from 'lucide-react'
import Button from '../components/ui/Button'
import SectionHeading from '../components/ui/SectionHeading'
import { serviceOptions } from '../data/booking'
import { leadStatuses } from '../data/crm'
import AddEnquiryDialog from './AddEnquiryDialog'
import FollowUpDialog from './FollowUpDialog'
import LeadStatusDialog from './LeadStatusDialog'
import NoteDialog from './NoteDialog'
import ProspectCard from './ProspectCard'
import { createLead, listLeads, updateCustomer, updateLead } from './api'
import { isFollowUpDue, nextFollowUp } from './crmFormat'
import { controlClass } from './fieldStyles'
import useAdminAction from './useAdminAction'

const openStatuses = leadStatuses.filter((status) => !['delivered', 'lost'].includes(status.id))
const isOpen = (lead) => openStatuses.some((status) => status.id === lead.status)

export default function AdminProspects({ onSessionExpired }) {
  const { run, busy, error, clearError } = useAdminAction(onSessionExpired)
  const [leads, setLeads] = useState(null)
  const [filters, setFilters] = useState({ status: '', service: '' })
  // { type: 'add' } or { type: 'status' | 'whatsapp' | 'note', lead } while a dialog is open.
  const [dialog, setDialog] = useState(null)

  useEffect(() => {
    run(listLeads).then((data) => setLeads(data ? data.leads : []))
    // Runs once: the list is loaded when the screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = () => {
    setDialog(null)
    clearError()
  }
  // Puts a saved lead back in the list, or drops it once it is delivered or lost.
  const put = (lead) => setLeads((current) => current.flatMap((item) => (item.id !== lead.id ? [item] : isOpen(lead) ? [lead] : [])))
  const save = async (action, onDone) => {
    const data = await run(action)
    if (!data) return
    onDone(data)
    close()
  }

  const due = (leads ?? []).filter((lead) => isFollowUpDue(lead)).length
  const shown = (leads ?? []).filter(
    (lead) => (!filters.status || lead.status === filters.status) && (!filters.service || lead.service === filters.service),
  )
  const filter = (name, label, options) => (
    <label className="block text-sm font-semibold">
      <span className="mb-2 block">{label}</span>
      <select value={filters[name]} onChange={(event) => setFilters({ ...filters, [name]: event.target.value })} className={controlClass()}>
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.id ?? option.value} value={option.id ?? option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )

  return (
    <>
      <SectionHeading align="left" eyebrow="Owner area" title="Prospects" subtitle="People who asked about an order. Keep in touch until it is delivered." />

      <p className={`mt-8 flex items-center gap-3 rounded-3xl p-4 text-lg font-semibold ${due > 0 ? 'bg-terracotta-deep text-white' : 'bg-butter-soft text-espresso'}`}>
        <BellRing className="size-6 shrink-0" aria-hidden="true" />
        {due === 0 ? 'Nobody to follow up today.' : `${due} ${due === 1 ? 'person' : 'people'} to follow up today`}
      </p>

      <Button size="lg" icon={Plus} onClick={() => setDialog({ type: 'add' })} className="mt-4 min-h-14 w-full sm:w-auto">
        Add enquiry
      </Button>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {filter('status', 'Show status', openStatuses)}
        {filter('service', 'Show service', serviceOptions)}
      </div>

      {error && !dialog && (
        <p role="alert" className="mt-6 rounded-3xl border border-terracotta-deep bg-butter-soft p-4 text-lg font-medium text-espresso">
          {error}
        </p>
      )}
      {leads === null && <p className="mt-8 text-lg text-espresso/75">Loading…</p>}
      {leads !== null && shown.length === 0 && !error && (
        <p className="mt-8 rounded-3xl bg-butter-soft p-6 text-lg text-espresso">
          {leads.length === 0 ? 'No open enquiries yet. New ones from the website appear here.' : 'No enquiries match these choices.'}
        </p>
      )}

      <ul className="mt-8 grid gap-6 lg:grid-cols-2">
        {shown.map((lead) => (
          <ProspectCard
            key={lead.id}
            lead={lead}
            busy={busy}
            onStatus={() => setDialog({ type: 'status', lead })}
            onWhatsApp={() => setDialog({ type: 'whatsapp', lead })}
            onNote={() => setDialog({ type: 'note', lead })}
          />
        ))}
      </ul>

      {dialog?.type === 'add' && (
        <AddEnquiryDialog busy={busy} error={error} onClose={close} onSave={(enquiry) => save(() => createLead(enquiry), (data) => setLeads((current) => [data.lead, ...current]))} />
      )}
      {dialog?.type === 'status' && (
        <LeadStatusDialog lead={dialog.lead} busy={busy} error={error} onClose={close} onSave={(changes) => save(() => updateLead(dialog.lead.id, changes), (data) => put(data.lead))} />
      )}
      {dialog?.type === 'whatsapp' && (
        <FollowUpDialog
          lead={dialog.lead}
          onClose={close}
          onSent={() => {
            // WhatsApp is already opening: close the dialog now and save the follow-up in the background.
            const { id } = dialog.lead
            close()
            run(() => updateLead(id, { followUpAt: nextFollowUp() })).then((data) => data && put(data.lead))
          }}
        />
      )}
      {dialog?.type === 'note' && (
        <NoteDialog customerName={dialog.lead.customer.name} busy={busy} error={error} onClose={close} onSave={(note) => save(() => updateCustomer(dialog.lead.customerId, { addNote: note }), () => {})} />
      )}
    </>
  )
}

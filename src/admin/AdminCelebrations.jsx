import { useEffect, useState } from 'react'
import { Check, PartyPopper } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import WhatsAppLink from '../components/ui/WhatsAppLink'
import { CELEBRATION_DAYS, celebrationTitle, wishMessage } from '../data/celebrations'
import { getCelebrations, markCelebrationDone } from './api'
import { displayPhone, formatDay, whatsappTo } from './crmFormat'
import { actionButton } from './fieldStyles'
import useAdminAction from './useAdminAction'

const when = (item) => (item.daysAway === 0 ? 'Today' : item.daysAway === 1 ? 'Tomorrow' : formatDay(item.date))

// Birthdays, anniversaries and event anniversaries in the coming week, for customers who agreed to offers.
export default function AdminCelebrations({ onSessionExpired }) {
  const { run, busy, error } = useAdminAction(onSessionExpired)
  const [items, setItems] = useState(null)

  useEffect(() => {
    run(getCelebrations).then((data) => setItems(data ? data.celebrations : []))
    // Runs once: the list is loaded when the screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // "Done" records that she sent her wishes this year, so the person leaves the list.
  const done = async (item) => {
    if (await run(() => markCelebrationDone(item.key, item.year))) setItems((current) => current.filter((other) => other.key !== item.key))
  }

  return (
    <>
      <SectionHeading
        align="left"
        eyebrow="Owner area"
        title="Celebrations"
        subtitle={`Special days in the next ${CELEBRATION_DAYS} days, for customers who agreed to hear from you. Send your wishes, then tap Done.`}
      />

      {error && (
        <p role="alert" className="mt-6 rounded-3xl border border-terracotta-deep bg-butter-soft p-4 text-lg font-medium text-espresso">
          {error}
        </p>
      )}
      {items === null && <p className="mt-8 text-lg text-espresso/75">Loading…</p>}
      {items?.length === 0 && !error && <p className="mt-8 rounded-3xl bg-butter-soft p-6 text-lg text-espresso">No celebrations in the next {CELEBRATION_DAYS} days.</p>}

      <ul className="mt-8 grid gap-6 lg:grid-cols-2">
        {(items ?? []).map((item) => (
          <li key={item.key} className={`rounded-3xl bg-cream p-4 shadow-sm md:p-6 ${item.daysAway === 0 ? 'border-2 border-terracotta' : 'border border-espresso/10'}`}>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-butter px-3 py-1 text-sm font-semibold text-espresso">
              <PartyPopper className="size-4" aria-hidden="true" />
              {when(item)}
            </p>
            <h3 className="mt-3 break-words text-xl font-semibold">{item.customer.name}</h3>
            <p className="break-words text-lg">{celebrationTitle(item)}</p>
            <p className="text-base text-espresso/75">
              {item.daysAway > 1 ? '' : `${formatDay(item.date)} · `}
              {displayPhone(item.customer.phone)}
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <WhatsAppLink href={whatsappTo(item.customer.phone, wishMessage(item))} className="w-full">
                Send wishes
              </WhatsAppLink>
              <button type="button" disabled={busy} onClick={() => done(item)} className={actionButton}>
                <Check className="size-5 shrink-0" aria-hidden="true" />
                Done
                <span className="sr-only">: wishes sent to {item.customer.name}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

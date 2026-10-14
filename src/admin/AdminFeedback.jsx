import { useEffect, useState } from 'react'
import { Eye, EyeOff, Star, Trash2 } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import { deleteFeedback, listFeedback, showFeedback } from './api'
import { displayPhone, formatDay } from './crmFormat'
import { actionButton } from './fieldStyles'
import useAdminAction from './useAdminAction'

const average = (list) => (list.length === 0 ? null : Math.round((list.reduce((sum, item) => sum + item.rating, 0) / list.length) * 10) / 10)

// Customer reviews, newest first. A review goes on the website only if the customer allowed it AND she switches it on.
export default function AdminFeedback({ onSessionExpired }) {
  const { run, busy, error, clearError } = useAdminAction(onSessionExpired)
  const [items, setItems] = useState(null)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    run(listFeedback).then((data) => setItems(data ? data.feedback : []))
    // Runs once: the list is loaded when the screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = async (item) => {
    const data = await run(() => showFeedback(item.id, !item.approved))
    if (data) setItems((current) => current.map((other) => (other.id === item.id ? data.feedback : other)))
  }
  const remove = async () => {
    if (!(await run(() => deleteFeedback(deleting.id)))) return
    setItems((current) => current.filter((other) => other.id !== deleting.id))
    setDeleting(null)
  }
  const score = average(items ?? [])

  return (
    <>
      <SectionHeading align="left" eyebrow="Owner area" title="Feedback" subtitle="What customers said. You choose which reviews show on the website." />

      {items?.length > 0 && (
        <p className="mt-8 flex items-center gap-3 rounded-3xl bg-butter-soft p-4 text-lg font-semibold text-espresso">
          <Star className="size-6 shrink-0 fill-butter text-terracotta-deep" aria-hidden="true" />
          {score} out of 5, from {items.length} {items.length === 1 ? 'review' : 'reviews'}
        </p>
      )}
      {error && !deleting && (
        <p role="alert" className="mt-6 rounded-3xl border border-terracotta-deep bg-butter-soft p-4 text-lg font-medium text-espresso">
          {error}
        </p>
      )}
      {items === null && <p className="mt-8 text-lg text-espresso/75">Loading…</p>}
      {items?.length === 0 && !error && (
        <p className="mt-8 rounded-3xl bg-butter-soft p-6 text-lg text-espresso">No feedback yet. Use “Ask for feedback” on a delivered order to invite a customer.</p>
      )}

      <ul className="mt-8 grid gap-6 lg:grid-cols-2">
        {(items ?? []).map((item) => {
          const VisibilityIcon = item.approved ? Eye : EyeOff
          return (
            <li key={item.id} className="rounded-3xl border border-espresso/10 bg-cream p-4 shadow-sm md:p-6">
              <div role="img" aria-label={`${item.rating} out of 5 stars`} className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`size-5 ${star <= item.rating ? 'fill-butter text-terracotta-deep' : 'text-espresso/25'}`} aria-hidden="true" />
                ))}
              </div>
              {item.comment ? <p className="mt-3 whitespace-pre-line break-words text-lg">“{item.comment}”</p> : <p className="mt-3 text-base text-espresso/75">No comment, only a rating.</p>}
              <p className="mt-3 break-words text-base font-semibold">{item.name}</p>
              <p className="text-base text-espresso/75">
                {formatDay(item.createdAt)}
                {item.phone && ` · ${displayPhone(item.phone)}`}
                {item.occasion && ` · ${item.occasion}`}
              </p>

              {item.canPublish && item.comment ? (
                <button
                  type="button"
                  aria-pressed={item.approved}
                  disabled={busy}
                  onClick={() => toggle(item)}
                  className={`mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-4 text-base font-semibold transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-60 motion-reduce:transition-none ${
                    item.approved ? 'bg-teal text-white hover:bg-navy' : 'border border-espresso/30 text-espresso hover:border-teal'
                  }`}
                >
                  <VisibilityIcon className="size-5" aria-hidden="true" />
                  {item.approved ? 'Showing on website' : 'Show on website'}
                </button>
              ) : (
                <p className="mt-4 rounded-2xl bg-butter-soft px-3 py-2 text-sm font-medium text-espresso">
                  {item.canPublish ? 'Nothing to show on the website: there is no comment.' : 'Private: this customer did not agree to show it on the website.'}
                </p>
              )}
              <button type="button" disabled={busy} onClick={() => setDeleting(item)} className={`${actionButton} mt-2 w-full`}>
                <Trash2 className="size-5 shrink-0 text-terracotta-deep" aria-hidden="true" />
                Delete
              </button>
            </li>
          )
        })}
      </ul>

      {deleting && (
        <ConfirmDeleteDialog
          message={`The review from ${deleting.name} will be deleted for good${deleting.approved ? ' and removed from the website' : ''}. You cannot undo this.`}
          busy={busy}
          error={error}
          onConfirm={remove}
          onClose={() => {
            setDeleting(null)
            clearError()
          }}
        />
      )}
    </>
  )
}

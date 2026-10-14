import { useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import { feedbackPage } from '../../data/feedback'
import { feedbackPrivacyLine } from '../../data/privacy'
import PrivacyNotice from '../sections/PrivacyNotice'
import Button from '../ui/Button'
import StarRating from '../ui/StarRating'

const control =
  'block min-h-12 w-full rounded-2xl border bg-cream px-4 py-3 text-base text-espresso transition duration-300 ease-out placeholder:text-espresso/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal motion-reduce:transition-none'
const label = 'mb-2 block text-sm font-semibold'
const offline = 'We could not send your feedback. Please check your internet and try again.'

// `orderId` comes from a personal link (/feedback?o=…): it pre-fills the name and ties the review to that order.
export default function FeedbackForm({ orderId, onSent }) {
  const [values, setValues] = useState({ name: '', phone: '', rating: 0, comment: '', canPublish: false, website: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const set = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '', form: '' }))
  }

  useEffect(() => {
    if (!orderId) return
    fetch(`/api/feedback?o=${encodeURIComponent(orderId)}`)
      .then((response) => (response.ok ? response.json() : null))
      // Only fill the name if they have not started typing one.
      .then((data) => data?.name && setValues((current) => (current.name ? current : { ...current, name: data.name })))
      .catch(() => {})
  }, [orderId])

  const onSubmit = async (event) => {
    event.preventDefault()
    const found = {}
    if (values.name.trim().length < 2) found.name = 'Please enter your name.'
    if (values.phone.trim() && !/^\+?[\d\s()-]{7,20}$/.test(values.phone.trim())) found.phone = 'Please enter a valid phone number, or leave it empty.'
    if (values.rating === 0) found.rating = 'Please tap a star to rate us.'
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSending(true)
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, name: values.name.trim(), phone: values.phone.trim(), comment: values.comment.trim(), ...(orderId && { orderId }) }),
      })
      const data = await response.json().catch(() => null)
      if (response.ok) return onSent()
      setErrors({ form: data?.error ?? offline })
    } catch {
      setErrors({ form: offline })
    }
    setSending(false)
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Feedback" className="grid gap-6">
      <div>
        <label htmlFor="feedback-name" className={label}>
          Your name <span className="text-navy" aria-hidden="true">*</span>
        </label>
        <input id="feedback-name" type="text" autoComplete="name" maxLength={80} required value={values.name} aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? 'feedback-name-error' : undefined} onChange={(event) => set('name', event.target.value)} className={`${control} ${errors.name ? 'border-terracotta-deep' : 'border-espresso/20'}`} />
        {errors.name && <p id="feedback-name-error" className="mt-2 text-sm font-medium text-espresso">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="feedback-phone" className={label}>Phone (optional)</label>
        <input id="feedback-phone" type="tel" autoComplete="tel" value={values.phone} aria-invalid={errors.phone ? true : undefined} aria-describedby={errors.phone ? 'feedback-phone-error' : undefined} onChange={(event) => set('phone', event.target.value)} className={`${control} ${errors.phone ? 'border-terracotta-deep' : 'border-espresso/20'}`} />
        {errors.phone && <p id="feedback-phone-error" className="mt-2 text-sm font-medium text-espresso">{errors.phone}</p>}
      </div>

      <StarRating name="feedback-rating" label={feedbackPage.ratingLabel} words={feedbackPage.ratingWords} value={values.rating} error={errors.rating} onChange={(stars) => set('rating', stars)} />

      <div>
        <label htmlFor="feedback-comment" className={label}>{feedbackPage.commentLabel}</label>
        <textarea id="feedback-comment" rows={4} maxLength={600} placeholder={feedbackPage.commentPlaceholder} value={values.comment} onChange={(event) => set('comment', event.target.value)} className={`${control} border-espresso/20`} />
      </div>

      <label className="flex min-h-11 cursor-pointer items-start gap-3 text-base text-espresso">
        <input type="checkbox" checked={values.canPublish} onChange={(event) => set('canPublish', event.target.checked)} className="mt-0.5 size-6 shrink-0 rounded accent-terracotta-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-butter-soft" />
        <span>{feedbackPage.consent}</span>
      </label>

      {/* Honeypot: hidden from people and screen readers. Only bots fill it in, and the server drops those. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="feedback-website">Website</label>
        <input id="feedback-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => set('website', event.target.value)} />
      </div>

      {errors.form && (
        <p role="alert" className="rounded-2xl border border-terracotta-deep bg-cream p-3 text-base font-medium text-espresso">
          {errors.form}
        </p>
      )}
      <div>
        <Button type="submit" size="lg" icon={Send} disabled={sending} className="w-full">
          {sending ? 'Sending…' : feedbackPage.submit}
        </Button>
        <PrivacyNotice line={feedbackPrivacyLine} />
      </div>
    </form>
  )
}

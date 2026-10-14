import { bookingExtras } from '../../data/booking'
import DayMonthField from '../ui/DayMonthField'

const select =
  'block min-h-12 w-full rounded-2xl border border-espresso/20 bg-cream px-4 py-3 text-base text-espresso transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal motion-reduce:transition-none'

// Optional extras saved with the enquiry but not sent in the WhatsApp message:
// birthday, anniversary, and consent to receive offers (never ticked for the customer).
export default function BookingExtras({ extras, onChange }) {
  const set = (name) => (value) => onChange({ ...extras, [name]: value })

  return (
    <div className="mt-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <DayMonthField id="booking-birthday" label={bookingExtras.birthday} value={extras.birthday} selectClassName={select} onChange={set('birthday')} />
        <DayMonthField id="booking-anniversary" label={bookingExtras.anniversary} value={extras.anniversary} selectClassName={select} onChange={set('anniversary')} />
      </div>

      <label className="mt-6 flex min-h-11 cursor-pointer items-start gap-3 text-base text-espresso">
        <input
          type="checkbox"
          checked={extras.consent}
          onChange={(event) => set('consent')(event.target.checked)}
          className="mt-0.5 size-6 shrink-0 rounded accent-terracotta-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-butter-soft"
        />
        <span>{bookingExtras.consent}</span>
      </label>

      {/* Honeypot: hidden from people and screen readers. Only bots fill it in, and the server drops those. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="booking-website">Website</label>
        <input
          id="booking-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={extras.website}
          onChange={(event) => set('website')(event.target.value)}
        />
      </div>
    </div>
  )
}

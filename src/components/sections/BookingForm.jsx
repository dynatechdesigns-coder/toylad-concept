import { useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { bookingFields } from '../../data/booking'
import {
  bookingMailto,
  buildBookingMessage,
  emptyBooking,
  optionsFor,
  todayISO,
  validateBooking,
  validateField,
  visibleFields,
} from '../../utils/booking'
import { saveEnquiry } from '../../utils/enquiry'
import { whatsappUrl } from '../../utils/format'
import Button from '../ui/Button'
import FormField from '../ui/FormField'
import BookingExtras from './BookingExtras'
import BookingSuccess from './BookingSuccess'
import PrivacyNotice from './PrivacyNotice'

const noDate = { day: '', month: '' }
const emptyExtras = { birthday: noDate, anniversary: noDate, consent: false, website: '' }

export default function BookingForm({ bookingPreset }) {
  const [values, setValues] = useState(emptyBooking)
  const [extras, setExtras] = useState(emptyExtras)
  const [errors, setErrors] = useState({})
  const [sentHref, setSentHref] = useState(null)
  const formRef = useRef(null)

  // A CTA elsewhere on the page chose a service (and maybe a package): reflect it in the form.
  // Every CTA click passes a new preset object, so repeat clicks re-apply it.
  const [appliedPreset, setAppliedPreset] = useState(bookingPreset)
  if (bookingPreset !== appliedPreset) {
    setAppliedPreset(bookingPreset)
    if (bookingPreset.service) {
      setValues({ ...values, service: bookingPreset.service, package: bookingPreset.package ?? '' })
      setErrors({ ...errors, service: '' })
      setSentHref(null)
    }
  }

  const setError = (name, value) => {
    const field = bookingFields.find((item) => item.name === name)
    setErrors((current) => ({ ...current, [name]: validateField(field, value) }))
  }

  const onChange = ({ target: { name, value } }) => {
    // The package list depends on the service, so a new service clears it.
    setValues((current) => ({ ...current, [name]: value, ...(name === 'service' && { package: '' }) }))
    if (errors[name]) setError(name, value)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const found = validateBooking(values)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      formRef.current.elements[firstInvalid]?.focus()
      return
    }
    const href = whatsappUrl(buildBookingMessage(values))
    window.open(href, '_blank', 'noopener,noreferrer')
    // Keep a copy for the shop's records. WhatsApp has already opened, so this cannot hold the customer up.
    saveEnquiry(values, extras)
    setSentHref(href)
  }

  const reset = () => {
    setValues(emptyBooking)
    setExtras(emptyExtras)
    setErrors({})
    setSentHref(null)
  }

  const mailtoHref = bookingMailto(values)

  if (sentHref) return <BookingSuccess whatsappHref={sentHref} mailtoHref={mailtoHref} onReset={reset} />

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Booking and custom order request">
      <p className="text-sm text-espresso/70">
        Fields marked <span className="font-semibold text-navy">*</span> are required.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {visibleFields(values).map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={values[field.name]}
            error={errors[field.name]}
            options={optionsFor(field, values)}
            min={field.type === 'date' ? todayISO() : undefined}
            onChange={onChange}
            onBlur={(event) => setError(field.name, event.target.value)}
          />
        ))}
      </div>
      <BookingExtras extras={extras} onChange={setExtras} />

      <Button type="submit" size="lg" icon={Send} className="mt-8 w-full">
        Send request on WhatsApp
      </Button>
      <PrivacyNotice />
      {mailtoHref && (
        <p className="mt-4 text-center text-sm text-espresso/70">
          Prefer email?{' '}
          <a
            href={mailtoHref}
            className="inline-flex min-h-11 items-center rounded-full font-semibold text-navy underline underline-offset-4 hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            Send these details by email
          </a>
        </p>
      )}
    </form>
  )
}

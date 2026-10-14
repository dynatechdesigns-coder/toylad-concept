import { useState } from 'react'
import Modal from '../components/ui/Modal'
import { serviceOptions } from '../data/booking'
import { leadSources } from '../data/crm'
import AdminField from './AdminField'
import DialogActions from './DialogActions'
import { controlClass } from './fieldStyles'

const manualSources = leadSources.filter((source) => source.manual)
const blank = { name: '', phone: '', service: '', source: manualSources[0].id, eventDate: '', guests: '', details: '' }
const required = { name: 'Please enter their name.', phone: 'Please enter their phone number.', service: 'Please choose what they asked about.' }

// Records an enquiry that came by WhatsApp, phone or in person.
export default function AddEnquiryDialog({ busy, error, onSave, onClose }) {
  const [values, setValues] = useState(blank)
  const [errors, setErrors] = useState({})

  const bind = (name) => ({
    id: `enquiry-${name}`,
    value: values[name],
    disabled: busy,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `enquiry-${name}-error` : undefined,
    className: controlClass(errors[name]),
    onChange: (event) => {
      setValues((current) => ({ ...current, [name]: event.target.value }))
      setErrors((current) => ({ ...current, [name]: '' }))
    },
  })

  const onSubmit = (event) => {
    event.preventDefault()
    const found = Object.fromEntries(Object.entries(required).filter(([name]) => !values[name].trim()))
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const enquiry = { name: values.name.trim(), phone: values.phone.trim(), service: values.service, source: values.source, details: values.details.trim() }
    if (values.eventDate) enquiry.eventDate = values.eventDate
    if (/^\d+$/.test(values.guests.trim())) enquiry.guests = Number(values.guests)
    onSave(enquiry)
  }

  return (
    <Modal title="Add enquiry" onClose={onClose}>
      <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-4">
        <AdminField id="enquiry-name" label="Name" error={errors.name}>
          <input type="text" maxLength={100} autoComplete="off" {...bind('name')} />
        </AdminField>
        <AdminField id="enquiry-phone" label="Phone number" error={errors.phone}>
          <input type="tel" inputMode="tel" autoComplete="off" placeholder="e.g. 0801 234 5678" {...bind('phone')} />
        </AdminField>
        <AdminField id="enquiry-service" label="What did they ask about?" error={errors.service}>
          <select {...bind('service')}>
            <option value="">Choose one</option>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminField id="enquiry-source" label="How did they reach you?">
          <select {...bind('source')}>
            {manualSources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.label}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminField id="enquiry-eventDate" label="Event date (if you know it)">
          <input type="date" {...bind('eventDate')} />
        </AdminField>
        <AdminField id="enquiry-guests" label="Number of guests (if you know it)">
          <input type="number" min={1} inputMode="numeric" {...bind('guests')} />
        </AdminField>
        <AdminField id="enquiry-details" label="What do they want?">
          <textarea rows={3} maxLength={3000} {...bind('details')} />
        </AdminField>
        <div>
          <DialogActions error={error} busy={busy} saveLabel="Save enquiry" onCancel={onClose} />
        </div>
      </form>
    </Modal>
  )
}

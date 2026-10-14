import { useState } from 'react'
import DayMonthField from '../components/ui/DayMonthField'
import Modal from '../components/ui/Modal'
import { fromDayMonth, toDayMonth } from '../utils/dayMonth'
import AdminField from './AdminField'
import DialogActions from './DialogActions'
import { displayPhone } from './crmFormat'
import { controlClass } from './fieldStyles'

export default function CustomerEditDialog({ customer, busy, error, onSave, onClose }) {
  const [values, setValues] = useState({
    name: customer.name,
    phone: displayPhone(customer.phone),
    email: customer.email ?? '',
    birthday: fromDayMonth(customer.birthday),
    anniversary: fromDayMonth(customer.anniversary),
    marketingConsent: customer.marketingConsent,
    notes: customer.notes,
  })
  const [errors, setErrors] = useState({})
  const set = (name) => (value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }
  const bind = (name) => ({
    id: `customer-${name}`,
    value: values[name],
    disabled: busy,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `customer-${name}-error` : undefined,
    className: controlClass(errors[name]),
    onChange: (event) => set(name)(event.target.value),
  })

  const onSubmit = (event) => {
    event.preventDefault()
    const found = {}
    if (!values.name.trim()) found.name = 'Please enter their name.'
    if (!values.phone.trim()) found.phone = 'Please enter their phone number.'
    setErrors(found)
    if (Object.keys(found).length > 0) return
    onSave({
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim() || null,
      birthday: toDayMonth(values.birthday),
      anniversary: toDayMonth(values.anniversary),
      marketingConsent: values.marketingConsent,
      notes: values.notes,
    })
  }

  return (
    <Modal title="Edit customer" onClose={onClose}>
      <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-4">
        <AdminField id="customer-name" label="Name" error={errors.name}>
          <input type="text" maxLength={100} autoComplete="off" {...bind('name')} />
        </AdminField>
        <AdminField id="customer-phone" label="Phone number" error={errors.phone}>
          <input type="tel" inputMode="tel" autoComplete="off" {...bind('phone')} />
        </AdminField>
        <AdminField id="customer-email" label="Email (if they have one)">
          <input type="email" maxLength={200} autoComplete="off" {...bind('email')} />
        </AdminField>
        <DayMonthField id="customer-birthday" label="Birthday" value={values.birthday} disabled={busy} selectClassName={controlClass()} onChange={set('birthday')} />
        <DayMonthField id="customer-anniversary" label="Wedding anniversary" value={values.anniversary} disabled={busy} selectClassName={controlClass()} onChange={set('anniversary')} />
        <label className="flex min-h-12 cursor-pointer items-start gap-3 text-base">
          <input
            type="checkbox"
            checked={values.marketingConsent}
            disabled={busy}
            onChange={(event) => set('marketingConsent')(event.target.checked)}
            className="mt-0.5 size-6 shrink-0 accent-terracotta-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          />
          <span>They agreed to receive offers and birthday wishes on WhatsApp.</span>
        </label>
        <AdminField id="customer-notes" label="Notes">
          <textarea rows={5} maxLength={5000} {...bind('notes')} />
        </AdminField>
        <div>
          <DialogActions error={error} busy={busy} onCancel={onClose} />
        </div>
      </form>
    </Modal>
  )
}

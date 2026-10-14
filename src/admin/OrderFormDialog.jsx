import { useState } from 'react'
import Modal from '../components/ui/Modal'
import { categoryForService, occasions } from '../data/orders'
import AdminField from './AdminField'
import CustomerPicker from './CustomerPicker'
import DialogActions from './DialogActions'
import OrderItemsField from './OrderItemsField'
import { displayPhone, serviceLabel } from './crmFormat'
import { controlClass } from './fieldStyles'
import { blankItem, noCustomer } from './orderDefaults'

const isAmount = (text) => /^\d+(\.\d{1,2})?$/.test(text.trim())

// Starting values: an existing order (edit), a prospect (its details are filled in), or empty.
function startValues(order, lead) {
  if (order) {
    return {
      items: order.items.map((item) => ({ ...item, quantity: String(item.quantity) })),
      amount: String(order.amount),
      deposit: order.deposit === null ? '' : String(order.deposit),
      deliveryDate: order.deliveryDate,
      occasion: order.occasion ?? '',
      notes: order.notes,
    }
  }
  const firstItem = lead ? { name: lead.package ?? serviceLabel(lead.service), category: categoryForService[lead.service] ?? '', quantity: '1' } : blankItem
  return { items: [firstItem], amount: '', deposit: '', deliveryDate: lead?.eventDate ?? '', occasion: '', notes: '' }
}

// New order, new order from a prospect (`lead`), or edit (`order`). The customer cannot change on an edit.
export default function OrderFormDialog({ order, lead, busy, error, onSave, onClose }) {
  const fixedCustomer = order?.customer ?? lead?.customer ?? null
  const [customer, setCustomer] = useState(noCustomer)
  const [values, setValues] = useState(() => startValues(order, lead))
  const [errors, setErrors] = useState({})
  const set = (name) => (value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }
  const bind = (name) => ({
    id: `order-${name}`,
    value: values[name],
    disabled: busy,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `order-${name}-error` : undefined,
    className: controlClass(errors[name]),
    onChange: (event) => set(name)(event.target.value),
  })

  const onSubmit = (event) => {
    event.preventDefault()
    const found = {}
    const isNew = customer.mode === 'new'
    if (!fixedCustomer && !order && (isNew ? !customer.name.trim() || !customer.phone.trim() : !customer.customer)) {
      found.customer = isNew ? 'Please enter their name and phone number.' : 'Please choose a customer, or add a new one.'
    }
    if (values.items.some((item) => !item.name.trim() || !item.category || !/^[1-9]\d*$/.test(item.quantity.trim()))) {
      found.items = 'Each item needs a name, a type and how many.'
    }
    if (!isAmount(values.amount)) found.amount = 'Please enter the amount in naira, numbers only.'
    if (values.deposit.trim() && !isAmount(values.deposit)) found.deposit = 'Please enter the deposit in naira, numbers only.'
    else if (values.deposit.trim() && isAmount(values.amount) && Number(values.deposit) > Number(values.amount)) found.deposit = 'The deposit cannot be more than the amount.'
    if (!values.deliveryDate) found.deliveryDate = 'Please choose the delivery date.'
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const details = {
      items: values.items.map((item) => ({ name: item.name.trim(), category: item.category, quantity: Number(item.quantity) })),
      amount: Number(values.amount),
      deposit: values.deposit.trim() ? Number(values.deposit) : null,
      deliveryDate: values.deliveryDate,
      occasion: values.occasion.trim() || null,
      notes: values.notes.trim(),
    }
    if (order) return onSave(details)
    if (lead) return onSave({ ...details, customerId: lead.customerId, leadId: lead.id })
    onSave(isNew ? { ...details, newCustomer: { name: customer.name.trim(), phone: customer.phone.trim() } } : { ...details, customerId: customer.customer.id })
  }

  return (
    <Modal title={order ? 'Edit order' : 'New order'} onClose={onClose}>
      <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-5">
        {fixedCustomer || order ? (
          <p className="rounded-2xl bg-butter-soft p-3 text-base">
            <span className="block font-semibold">{fixedCustomer?.name ?? 'Deleted customer'}</span>
            {fixedCustomer && displayPhone(fixedCustomer.phone)}
          </p>
        ) : (
          <CustomerPicker
            value={customer}
            error={errors.customer}
            disabled={busy}
            onChange={(next) => {
              setCustomer(next)
              setErrors((current) => ({ ...current, customer: '' }))
            }}
          />
        )}
        <OrderItemsField items={values.items} error={errors.items} disabled={busy} onChange={set('items')} />
        <AdminField id="order-amount" label="Total amount (₦)" error={errors.amount}>
          <input type="text" inputMode="decimal" autoComplete="off" placeholder="e.g. 45000" {...bind('amount')} />
        </AdminField>
        <AdminField id="order-deposit" label="Deposit paid (₦), if any" error={errors.deposit}>
          <input type="text" inputMode="decimal" autoComplete="off" {...bind('deposit')} />
        </AdminField>
        <AdminField id="order-deliveryDate" label="Delivery date" error={errors.deliveryDate}>
          <input type="date" {...bind('deliveryDate')} />
        </AdminField>
        <AdminField id="order-occasion" label="Occasion (if you know it)">
          <input type="text" maxLength={60} list="order-occasions" autoComplete="off" placeholder="e.g. Wedding" {...bind('occasion')} />
          <datalist id="order-occasions">
            {occasions.map((occasion) => (
              <option key={occasion} value={occasion} />
            ))}
          </datalist>
        </AdminField>
        <AdminField id="order-notes" label="Notes">
          <textarea rows={3} maxLength={2000} {...bind('notes')} />
        </AdminField>
        <div>
          <DialogActions error={error} busy={busy} saveLabel="Save order" onCancel={onClose} />
        </div>
      </form>
    </Modal>
  )
}

import { useEffect, useState } from 'react'
import AdminField from './AdminField'
import { listCustomers } from './api'
import { displayPhone, matchesCustomer } from './crmFormat'
import { actionButton, controlClass } from './fieldStyles'

// Choose who an order is for: find an existing customer by name or phone, or type a new one.
// `value` is { mode: 'existing' | 'new', customer, name, phone }.
export default function CustomerPicker({ value, error, disabled, onChange }) {
  const [customers, setCustomers] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    // If the list cannot load she can still add the customer as new.
    listCustomers()
      .then((data) => setCustomers(data.customers))
      .catch(() => {})
  }, [])

  const matches = query.trim() ? customers.filter((customer) => matchesCustomer(customer, query)).slice(0, 5) : []
  const modeButton = (mode, label) => (
    <button
      type="button"
      aria-pressed={value.mode === mode}
      onClick={() => onChange({ ...value, mode, customer: null })}
      className={`${actionButton} aria-pressed:border-terracotta-deep aria-pressed:bg-terracotta-deep aria-pressed:text-white`}
    >
      {label}
    </button>
  )

  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="mb-2 block text-base font-semibold">Who is it for?</legend>
      <div className="grid grid-cols-2 gap-2">
        {modeButton('existing', 'Find customer')}
        {modeButton('new', 'New customer')}
      </div>

      {value.mode === 'existing' && value.customer && (
        <p className="mt-3 rounded-2xl bg-butter-soft p-3 text-base">
          <span className="block font-semibold">{value.customer.name}</span>
          {displayPhone(value.customer.phone)}
        </p>
      )}
      {value.mode === 'existing' && !value.customer && (
        <div className="mt-3">
          <input
            type="search"
            aria-label="Find a customer by name or phone number"
            placeholder="Type a name or phone number"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={controlClass(error)}
          />
          <ul className="mt-2 grid gap-2">
            {matches.map((customer) => (
              <li key={customer.id}>
                <button type="button" onClick={() => onChange({ ...value, customer })} className={`${actionButton} w-full justify-between`}>
                  <span className="min-w-0 truncate">{customer.name}</span>
                  <span className="shrink-0 text-sm font-normal text-espresso/75">{displayPhone(customer.phone)}</span>
                </button>
              </li>
            ))}
          </ul>
          {query.trim() && matches.length === 0 && <p className="mt-2 text-base text-espresso/75">Nobody found. Tap “New customer” to add them.</p>}
        </div>
      )}

      {value.mode === 'new' && (
        <div className="mt-3 grid gap-3">
          <AdminField id="order-customer-name" label="Their name">
            <input id="order-customer-name" type="text" maxLength={100} autoComplete="off" value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} className={controlClass()} />
          </AdminField>
          <AdminField id="order-customer-phone" label="Their phone number">
            <input id="order-customer-phone" type="tel" inputMode="tel" autoComplete="off" placeholder="e.g. 0801 234 5678" value={value.phone} onChange={(event) => onChange({ ...value, phone: event.target.value })} className={controlClass()} />
          </AdminField>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 text-base font-medium text-espresso">
          {error}
        </p>
      )}
    </fieldset>
  )
}

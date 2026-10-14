import { useEffect, useState } from 'react'
import { ChevronRight, Search } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import CustomerDetail from './CustomerDetail'
import { listCustomers } from './api'
import { displayPhone, matchesCustomer, timeAgo } from './crmFormat'
import { controlClass } from './fieldStyles'
import useAdminAction from './useAdminAction'

export default function AdminCustomers({ onSessionExpired }) {
  const { run, error } = useAdminAction(onSessionExpired)
  const [customers, setCustomers] = useState(null)
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    run(listCustomers).then((data) => setCustomers(data ? data.customers : []))
    // Runs once: the list is loaded when the screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (openId) {
    return (
      <CustomerDetail
        id={openId}
        onBack={() => setOpenId(null)}
        onChanged={(customer) => setCustomers((current) => current.map((item) => (item.id === customer.id ? customer : item)))}
        onDeleted={(id) => {
          setCustomers((current) => current.filter((item) => item.id !== id))
          setOpenId(null)
        }}
        onSessionExpired={onSessionExpired}
      />
    )
  }

  const shown = (customers ?? []).filter((customer) => matchesCustomer(customer, query))

  return (
    <>
      <SectionHeading align="left" eyebrow="Owner area" title="Customers" subtitle="Everyone who has sent an enquiry. Tap a name to see their details." />

      <div className="relative mt-8">
        <label htmlFor="customer-search" className="mb-2 block text-base font-semibold">
          Find a customer
        </label>
        <Search className="pointer-events-none absolute bottom-4 left-4 size-6 text-espresso/50" aria-hidden="true" />
        <input
          id="customer-search"
          type="search"
          value={query}
          placeholder="Name or phone number"
          autoComplete="off"
          onChange={(event) => setQuery(event.target.value)}
          className={`${controlClass()} pl-12`}
        />
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-3xl border border-terracotta-deep bg-butter-soft p-4 text-lg font-medium text-espresso">
          {error}
        </p>
      )}
      {customers === null && <p className="mt-8 text-lg text-espresso/75">Loading…</p>}
      {customers !== null && shown.length === 0 && !error && (
        <p className="mt-8 rounded-3xl bg-butter-soft p-6 text-lg text-espresso">
          {customers.length === 0 ? 'No customers yet. They are added when someone sends an enquiry.' : 'Nobody matches that name or number.'}
        </p>
      )}

      {shown.length > 0 && (
        <p className="mt-6 text-base text-espresso/75" aria-live="polite">
          {shown.length} {shown.length === 1 ? 'customer' : 'customers'}
        </p>
      )}
      <ul className="mt-3 grid gap-3 lg:grid-cols-2">
        {shown.map((customer) => (
          <li key={customer.id}>
            <button
              type="button"
              onClick={() => setOpenId(customer.id)}
              className="flex min-h-16 w-full items-center gap-3 rounded-3xl border border-espresso/10 bg-cream p-4 text-left shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="min-w-0 flex-1">
                <span className="block break-words font-display text-xl font-semibold">{customer.name}</span>
                <span className="block text-base text-espresso/75">{displayPhone(customer.phone)}</span>
                <span className="block text-sm text-espresso/70">
                  Last contact {timeAgo(customer.lastContactAt)}
                  {customer.marketingConsent && ' · Agreed to offers'}
                </span>
              </span>
              <ChevronRight className="size-6 shrink-0 text-teal" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

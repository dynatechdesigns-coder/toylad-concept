import WhatsAppLink from '../components/ui/WhatsAppLink'
import { weMissYouMessage } from '../data/orders'
import { displayPhone, formatDay, formatNaira, whatsappTo } from './crmFormat'

// A list of customers on the Reports screen. `missYou` adds the "We miss you" WhatsApp button,
// but only for customers who agreed to receive offers.
export default function ReportCustomers({ customers, missYou = false, emptyText }) {
  if (customers.length === 0) return <p className="mt-3 text-base text-espresso/75">{emptyText}</p>

  return (
    <ul className="mt-4 divide-y divide-espresso/10">
      {customers.map((customer) => (
        <li key={customer.id} className="py-3">
          <p className="break-words text-lg font-semibold">{customer.name}</p>
          <p className="text-base text-espresso/75">
            {displayPhone(customer.phone)} · {customer.orders} {customer.orders === 1 ? 'order' : 'orders'} · {formatNaira(customer.spent)}
          </p>
          <p className="text-base text-espresso/75">Last order: {formatDay(customer.lastOrderDate)}</p>
          {missYou &&
            (customer.marketingConsent ? (
              <WhatsAppLink href={whatsappTo(customer.phone, weMissYouMessage(customer.name))} className="mt-3 w-full sm:w-auto">
                We miss you
              </WhatsAppLink>
            ) : (
              <p className="mt-2 text-sm text-espresso/70">Did not agree to offers, so no message button.</p>
            ))}
        </li>
      ))}
    </ul>
  )
}

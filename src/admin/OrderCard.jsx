import { CalendarClock, CircleCheck, Pencil, X } from 'lucide-react'
import WhatsAppLink from '../components/ui/WhatsAppLink'
import { feedbackRequestMessage } from '../data/feedback'
import { orderStatuses } from '../data/orders'
import { displayPhone, formatDay, formatNaira, whatsappTo } from './crmFormat'
import { actionButton } from './fieldStyles'

const statusLabel = (id) => orderStatuses.find((status) => status.id === id)?.label ?? id
const pill = 'rounded-full px-3 py-1 text-sm font-semibold'

// One order. `flag` is 'week' (delivery within 7 days), 'late' (date has passed) or undefined.
// Pass only the handlers that apply: a delivered or cancelled order can only be edited.
export default function OrderCard({ order, flag, busy, onDelivered, onCancel, onEdit }) {
  const balance = order.deposit === null ? null : order.amount - order.deposit
  // Each delivered order has its own feedback link, which pre-fills the customer's name on the form.
  const feedbackLink = `${window.location.origin}/feedback?o=${order.id}`

  return (
    <li className={`rounded-3xl bg-cream p-4 shadow-sm md:p-6 ${flag ? 'border-2 border-terracotta' : 'border border-espresso/10'}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`${pill} bg-butter text-espresso`}>{statusLabel(order.status)}</span>
        {flag && (
          <span className={`${pill} inline-flex items-center gap-1.5 bg-terracotta-deep text-white`}>
            <CalendarClock className="size-4" aria-hidden="true" />
            {flag === 'week' ? 'This week' : 'Date has passed'}
          </span>
        )}
      </div>

      <h4 className="mt-3 break-words text-xl font-semibold">{order.customer?.name ?? 'Deleted customer'}</h4>
      {order.customer && <p className="text-base text-espresso/75">{displayPhone(order.customer.phone)}</p>}

      <ul className="mt-3 space-y-1 text-base">
        {order.items.map((item, index) => (
          // Items have no id of their own, and the same item can appear twice.
          // eslint-disable-next-line react/no-array-index-key
          <li key={index} className="break-words">
            {item.quantity} × {item.name}
          </li>
        ))}
      </ul>

      <dl className="mt-3 space-y-1 text-base">
        <div className="flex gap-2">
          <dt className="shrink-0 font-semibold">Delivery:</dt>
          <dd>{formatDay(order.deliveryDate)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 font-semibold">Amount:</dt>
          <dd>
            {formatNaira(order.amount)}
            {balance !== null && ` (deposit ${formatNaira(order.deposit)}, ${balance > 0 ? `${formatNaira(balance)} still to pay` : 'fully paid'})`}
          </dd>
        </div>
        {order.occasion && (
          <div className="flex gap-2">
            <dt className="shrink-0 font-semibold">Occasion:</dt>
            <dd className="min-w-0 break-words">{order.occasion}</dd>
          </div>
        )}
      </dl>
      {order.notes && <p className="mt-3 whitespace-pre-line break-words text-base text-espresso/75">{order.notes}</p>}

      {order.status === 'delivered' && order.customer && (
        <WhatsAppLink href={whatsappTo(order.customer.phone, feedbackRequestMessage({ name: order.customer.name, link: feedbackLink }))} className="mt-4 w-full">
          Ask for feedback
        </WhatsAppLink>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {onDelivered && (
          <button type="button" disabled={busy} onClick={onDelivered} className={`${actionButton} border-teal bg-teal text-white hover:bg-navy hover:text-white`}>
            <CircleCheck className="size-5 shrink-0" aria-hidden="true" />
            Mark delivered
          </button>
        )}
        {onCancel && (
          <button type="button" disabled={busy} onClick={onCancel} className={actionButton}>
            <X className="size-5 shrink-0 text-terracotta-deep" aria-hidden="true" />
            Cancel
          </button>
        )}
        <button type="button" disabled={busy} onClick={onEdit} className={actionButton}>
          <Pencil className="size-5 shrink-0" aria-hidden="true" />
          Edit
        </button>
      </div>
    </li>
  )
}

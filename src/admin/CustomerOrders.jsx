import { orderStatuses } from '../data/orders'
import { formatDay, formatNaira } from './crmFormat'

const statusLabel = (id) => orderStatuses.find((status) => status.id === id)?.label ?? id

// A customer's order history with three totals on top. Cancelled orders are listed but not counted.
export default function CustomerOrders({ orders }) {
  const counted = orders.filter((order) => order.status !== 'cancelled')
  const lastOrder = counted.map((order) => order.orderDate).sort().at(-1)
  const totals = [
    ['Orders', counted.length],
    ['Total spent', formatNaira(counted.reduce((sum, order) => sum + order.amount, 0))],
    ['Last order', lastOrder ? formatDay(lastOrder) : 'None yet'],
  ]

  return (
    <>
      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        {totals.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-butter-soft p-4">
            <dt className="text-sm font-semibold text-navy">{label}</dt>
            <dd className="mt-1 break-words text-lg font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      {orders.length === 0 && <p className="mt-3 text-base text-espresso/75">No orders on record.</p>}
      <ul className="mt-4 grid gap-4">
        {orders.map((order) => (
          <li key={order.id} className="rounded-3xl border border-espresso/10 bg-cream p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-butter px-3 py-1 text-sm font-semibold text-espresso">{statusLabel(order.status)}</span>
              <span className="text-lg font-semibold">{formatNaira(order.amount)}</span>
            </div>
            <p className="mt-3 break-words text-base">{order.items.map((item) => `${item.quantity} × ${item.name}`).join(', ')}</p>
            <p className="mt-1 text-base text-espresso/75">
              Delivery: {formatDay(order.deliveryDate)}
              {order.occasion && ` · ${order.occasion}`}
            </p>
          </li>
        ))}
      </ul>
    </>
  )
}

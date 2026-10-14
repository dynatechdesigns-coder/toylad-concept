import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/ui/Button'
import SectionHeading from '../components/ui/SectionHeading'
import { todayISO } from '../utils/booking'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import OrderCard from './OrderCard'
import OrderFormDialog from './OrderFormDialog'
import { createOrder, listOrders, updateOrder } from './api'
import { daysFrom } from './crmFormat'
import useAdminAction from './useAdminAction'

export default function AdminOrders({ onSessionExpired }) {
  const { run, busy, error, clearError } = useAdminAction(onSessionExpired)
  const [orders, setOrders] = useState(null)
  // { type: 'new' } or { type: 'edit' | 'cancel', order } while a dialog is open.
  const [dialog, setDialog] = useState(null)

  useEffect(() => {
    run(listOrders).then((data) => setOrders(data ? data.orders : []))
    // Runs once: the list is loaded when the screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = () => {
    setDialog(null)
    clearError()
  }
  const put = (order) => setOrders((current) => (current.some((item) => item.id === order.id) ? current.map((item) => (item.id === order.id ? order : item)) : [order, ...current]))
  const save = async (action) => {
    const data = await run(action)
    if (!data) return
    put(data.order)
    close()
  }

  const today = todayISO()
  const weekEnd = daysFrom(today, 6)
  // Upcoming: still to deliver, soonest first. Past: delivered or cancelled, newest first.
  const upcoming = (orders ?? []).filter((order) => order.status === 'confirmed').sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate))
  const past = (orders ?? []).filter((order) => order.status !== 'confirmed').sort((a, b) => b.deliveryDate.localeCompare(a.deliveryDate))
  const flagFor = (order) => (order.deliveryDate < today ? 'late' : order.deliveryDate <= weekEnd ? 'week' : undefined)
  const thisWeek = upcoming.filter((order) => flagFor(order) === 'week').length

  const list = (items, upcomingList) => (
    <ul className="mt-6 grid gap-6 lg:grid-cols-2">
      {items.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          flag={upcomingList ? flagFor(order) : undefined}
          busy={busy}
          onDelivered={upcomingList ? () => save(() => updateOrder(order.id, { status: 'delivered' })) : undefined}
          onCancel={upcomingList ? () => setDialog({ type: 'cancel', order }) : undefined}
          onEdit={() => setDialog({ type: 'edit', order })}
        />
      ))}
    </ul>
  )

  return (
    <>
      <SectionHeading align="left" eyebrow="Owner area" title="Orders" subtitle="Every confirmed order, with what is due for delivery first." />
      <Button size="lg" icon={Plus} onClick={() => setDialog({ type: 'new' })} className="mt-8 min-h-14 w-full sm:w-auto">
        New order
      </Button>

      {error && !dialog && (
        <p role="alert" className="mt-6 rounded-3xl border border-terracotta-deep bg-butter-soft p-4 text-lg font-medium text-espresso">
          {error}
        </p>
      )}
      {orders === null && <p className="mt-8 text-lg text-espresso/75">Loading…</p>}

      {orders !== null && (
        <>
          <section aria-labelledby="orders-upcoming" className="mt-10">
            <h3 id="orders-upcoming" className="text-xl font-semibold md:text-2xl">
              Coming up
            </h3>
            <p className="mt-2 text-base text-espresso/75 md:text-lg">
              {upcoming.length === 0 ? 'No orders waiting to be delivered.' : `${upcoming.length} to deliver, ${thisWeek} of them this week.`}
            </p>
            {list(upcoming, true)}
          </section>
          <section aria-labelledby="orders-past" className="mt-12">
            <h3 id="orders-past" className="text-xl font-semibold md:text-2xl">
              Past orders
            </h3>
            {past.length === 0 && <p className="mt-2 text-base text-espresso/75 md:text-lg">Delivered and cancelled orders appear here.</p>}
            {list(past, false)}
          </section>
        </>
      )}

      {dialog?.type === 'new' && <OrderFormDialog busy={busy} error={error} onClose={close} onSave={(details) => save(() => createOrder(details))} />}
      {dialog?.type === 'edit' && <OrderFormDialog order={dialog.order} busy={busy} error={error} onClose={close} onSave={(details) => save(() => updateOrder(dialog.order.id, details))} />}
      {dialog?.type === 'cancel' && (
        <ConfirmDeleteDialog
          message={`The order for ${dialog.order.customer?.name ?? 'this customer'} will be marked as cancelled. It stays in Past orders but no longer counts in your sales.`}
          confirmLabel="Yes, cancel order"
          busyLabel="Cancelling…"
          busy={busy}
          error={error}
          onConfirm={() => save(() => updateOrder(dialog.order.id, { status: 'cancelled' }))}
          onClose={close}
        />
      )}
    </>
  )
}

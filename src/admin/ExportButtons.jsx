import { Download } from 'lucide-react'
import { listCustomers, listOrders } from './api'
import { exportCustomers, exportOrders } from './exportCsv'
import { actionButton } from './fieldStyles'
import useAdminAction from './useAdminAction'

// Backup copies as CSV files, which open in Excel.
export default function ExportButtons({ onSessionExpired }) {
  const { run, busy, error } = useAdminAction(onSessionExpired)

  const exportAll = (load, key, save) => async () => {
    const data = await run(load)
    if (data) save(data[key])
  }

  return (
    <>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button type="button" disabled={busy} onClick={exportAll(listCustomers, 'customers', exportCustomers)} className={actionButton}>
          <Download className="size-5 shrink-0" aria-hidden="true" />
          Export customers to Excel
        </button>
        <button type="button" disabled={busy} onClick={exportAll(listOrders, 'orders', exportOrders)} className={actionButton}>
          <Download className="size-5 shrink-0" aria-hidden="true" />
          Export orders to Excel
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-base font-medium text-espresso">
          {error}
        </p>
      )}
    </>
  )
}

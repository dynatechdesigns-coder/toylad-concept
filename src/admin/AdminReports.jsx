import { useEffect, useState } from 'react'
import SectionHeading from '../components/ui/SectionHeading'
import { LOYAL_ORDERS, QUIET_MONTHS, orderCategories, sellerPeriods } from '../data/orders'
import BarList from './BarList'
import ExportButtons from './ExportButtons'
import ReportCard from './ReportCard'
import ReportCustomers from './ReportCustomers'
import { getReports } from './api'
import { formatNaira, lostReasonLabel, monthLabel } from './crmFormat'
import { actionButton } from './fieldStyles'
import useAdminAction from './useAdminAction'

const categoryLabel = (id) => orderCategories.find((category) => category.id === id)?.label ?? id
const units = (count) => `${count} ${count === 1 ? 'unit' : 'units'}`

export default function AdminReports({ onSessionExpired }) {
  const { run, error } = useAdminAction(onSessionExpired)
  const [report, setReport] = useState(null)
  const [period, setPeriod] = useState(sellerPeriods[0].id)

  useEffect(() => {
    run(getReports).then((data) => data && setReport(data))
    // Runs once: the numbers are loaded when the screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const heading = <SectionHeading align="left" eyebrow="Owner area" title="Reports" subtitle="How the business is doing. Cancelled orders are never counted." />
  if (!report) {
    return (
      <>
        {heading}
        <p role={error ? 'alert' : 'status'} className="mt-8 text-lg text-espresso/75">
          {error || 'Loading…'}
        </p>
      </>
    )
  }

  const sellers = report.topSellers[period]
  const tiles = [
    { label: 'Orders', value: report.month.orders },
    { label: 'Total sales', value: formatNaira(report.month.sales) },
    { label: 'New customers', value: report.month.newCustomers },
  ]

  return (
    <>
      {heading}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ReportCard id="report-month" title="This month" hint={monthLabel(report.month.label, 'long')}>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            {tiles.map((tile) => (
              <div key={tile.label} className="rounded-2xl bg-butter-soft p-4">
                <dt className="text-sm font-semibold text-navy">{tile.label}</dt>
                <dd className="mt-1 break-words font-display text-3xl font-semibold">{tile.value}</dd>
              </div>
            ))}
          </dl>
        </ReportCard>

        <ReportCard id="report-sellers" title="Top sellers" hint="What is ordered most, counted by number of orders.">
          <div role="group" aria-label="Period for top sellers" className="mt-4 grid grid-cols-3 gap-2">
            {sellerPeriods.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.id === period}
                onClick={() => setPeriod(item.id)}
                className={`${actionButton} px-1 text-sm aria-pressed:border-terracotta-deep aria-pressed:bg-terracotta-deep aria-pressed:text-white`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div id="sellers-panel" aria-live="polite">
            <h4 className="mt-6 font-sans text-base font-semibold text-navy">By type</h4>
            <BarList unit="order" emptyText="No orders in this period yet." rows={sellers.categories.map((item) => ({ key: item.id, label: categoryLabel(item.id), value: item.orders, note: units(item.quantity) }))} />
            <h4 className="mt-6 font-sans text-base font-semibold text-navy">By item</h4>
            <BarList unit="order" emptyText="No orders in this period yet." rows={sellers.items.map((item) => ({ key: item.name.toLowerCase(), label: item.name, value: item.orders, note: units(item.quantity) }))} />
          </div>
        </ReportCard>

        <ReportCard id="report-busy" title="Busy months" hint="Orders by delivery date, for the last 12 months.">
          <BarList unit="order" emptyText="No orders yet." rows={report.busyMonths.map((item) => ({ key: item.month, label: monthLabel(item.month), value: item.orders }))} />
        </ReportCard>

        <ReportCard id="report-lost" title="Why we lose enquiries" hint="Reasons chosen when an enquiry was marked Lost.">
          <BarList unit="enquiry" plural="enquiries" emptyText="No lost enquiries recorded." rows={report.lostReasons.map((item) => ({ key: item.id, label: lostReasonLabel(item.id), value: item.count }))} />
        </ReportCard>

        <ReportCard id="report-loyal" title="Loyal customers" hint={`Customers with ${LOYAL_ORDERS} or more orders.`}>
          <ReportCustomers customers={report.loyal} emptyText={`Nobody has ${LOYAL_ORDERS} orders yet.`} />
        </ReportCard>

        <ReportCard id="report-quiet" title="Quiet customers" hint={`Ordered before, but nothing in the last ${QUIET_MONTHS} months.`}>
          <ReportCustomers customers={report.quiet} missYou emptyText="Nobody has gone quiet." />
        </ReportCard>

        <ReportCard id="report-backup" title="Backup copy" hint="Save your customers and orders as files you can open in Excel.">
          <ExportButtons onSessionExpired={onSessionExpired} />
        </ReportCard>
      </div>
    </>
  )
}

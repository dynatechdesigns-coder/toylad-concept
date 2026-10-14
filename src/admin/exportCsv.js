import { orderCategories } from '../data/orders'
import { todayISO } from '../utils/booking'
import { formatDayMonth } from '../utils/dayMonth'
import { displayPhone } from './crmFormat'

const day = (date) => (date ? String(date).slice(0, 10) : '')

// One CSV cell. Text that Excel would run as a formula (=, +, -, @) gets a leading apostrophe.
function cell(value) {
  let text = value === null || value === undefined ? '' : String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

// Saves rows as a .csv file that opens in Excel. The BOM makes Excel read names and ₦ correctly.
function download(name, headers, rows) {
  const csv = `﻿${[headers, ...rows].map((row) => row.map(cell).join(',')).join('\r\n')}\r\n`
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `toylad-${name}-${todayISO()}.csv`
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function exportCustomers(customers) {
  download(
    'customers',
    ['Name', 'Phone', 'Email', 'Birthday', 'Wedding anniversary', 'Agreed to offers', 'Agreed on', 'Customer since', 'Last contact', 'Notes'],
    customers.map((customer) => [
      customer.name,
      displayPhone(customer.phone),
      customer.email ?? '',
      formatDayMonth(customer.birthday),
      formatDayMonth(customer.anniversary),
      customer.marketingConsent ? 'Yes' : 'No',
      day(customer.consentDate),
      day(customer.createdAt),
      day(customer.lastContactAt),
      customer.notes,
    ]),
  )
}

const categoryLabel = (id) => orderCategories.find((category) => category.id === id)?.label ?? id

export function exportOrders(orders) {
  download(
    'orders',
    ['Order date', 'Delivery date', 'Customer', 'Phone', 'Items', 'Amount (naira)', 'Deposit (naira)', 'Status', 'Occasion', 'Notes'],
    orders.map((order) => [
      order.orderDate,
      order.deliveryDate,
      order.customer?.name ?? 'Deleted customer',
      order.customer ? displayPhone(order.customer.phone) : '',
      order.items.map((item) => `${item.quantity} x ${item.name} (${categoryLabel(item.category)})`).join('; '),
      order.amount,
      order.deposit ?? '',
      order.status,
      order.occasion ?? '',
      order.notes,
    ]),
  )
}

import { addDays, buildCelebrations } from './celebrations.js'
import { todayInNigeria } from './orders.js'

const FOLLOW_UP_MS = 2 * 24 * 60 * 60 * 1000
const FEEDBACK_AFTER_DAYS = 3
const NIGERIA_OFFSET_MS = 60 * 60 * 1000

const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const firstName = (name) => name.split(' ')[0]

function celebrationLine(item) {
  if (item.kind === 'birthday') return `${item.customer.name}: birthday today`
  if (item.kind === 'anniversary') return `${item.customer.name}: wedding anniversary today`
  return `${item.customer.name}: ${item.years} ${item.years === 1 ? 'year' : 'years'} since ${firstName(item.customer.name)}'s ${item.occasion.toLowerCase()}`
}

// What the morning email reports: today's celebrations, prospects waiting for a follow-up,
// and orders delivered three days ago (time to ask how it went).
export function buildDigest({ customers, orders, leads, sent, now = Date.now(), today = todayInNigeria() }) {
  const byId = new Map(customers.map((customer) => [String(customer._id), customer]))
  const nameOf = (id) => byId.get(String(id))?.name ?? 'A customer'

  const celebrations = buildCelebrations({ customers, orders, sent, today }).filter((item) => item.daysAway === 0).map(celebrationLine)

  const followUps = leads
    .filter((lead) => ['new', 'quoted'].includes(lead.status))
    .filter((lead) => (lead.followUpAt ? lead.followUpAt.getTime() <= now : now - lead.createdAt.getTime() >= FOLLOW_UP_MS))
    .map((lead) => `${nameOf(lead.customerId)}: ${lead.status === 'quoted' ? 'quote sent, no answer yet' : 'new enquiry, not answered yet'}`)

  // The day it was marked delivered (in Nigerian time), or the planned delivery date for older records.
  const deliveredOn = (order) => (order.deliveredAt ? new Date(order.deliveredAt.getTime() + NIGERIA_OFFSET_MS).toISOString().slice(0, 10) : order.deliveryDate)
  const feedbackDay = addDays(today, -FEEDBACK_AFTER_DAYS)
  const feedback = orders
    .filter((order) => order.status === 'delivered' && order.customerId && deliveredOn(order) === feedbackDay)
    .map((order) => `${nameOf(order.customerId)}: ${order.items[0]?.name ?? 'order'} delivered ${FEEDBACK_AFTER_DAYS} days ago`)

  return { celebrations, followUps, feedback, total: celebrations.length + followUps.length + feedback.length }
}

// Turns a digest into an email. `adminUrl` is the address of the admin area.
export function renderDigest(digest, adminUrl, businessName) {
  const sections = [
    { title: 'Celebrations today', intro: 'Send them your wishes.', lines: digest.celebrations, link: `${adminUrl}#celebrations`, linkText: 'Open Celebrations' },
    { title: 'People to follow up', intro: 'These enquiries are waiting for you.', lines: digest.followUps, link: `${adminUrl}#prospects`, linkText: 'Open Prospects' },
    { title: 'Ask for feedback', intro: 'Ask how it went and whether they would share a review.', lines: digest.feedback, link: `${adminUrl}#orders`, linkText: 'Open Orders' },
  ].filter((section) => section.lines.length > 0)

  const subject = `${businessName}: ${digest.total} ${digest.total === 1 ? 'thing' : 'things'} for today`
  const text = sections.map((section) => `${section.title}\n${section.intro}\n${section.lines.map((line) => `- ${line}`).join('\n')}\n${section.linkText}: ${section.link}`).join('\n\n')
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#231915;max-width:560px">
<h1 style="font-size:22px;margin:0 0 16px">Good morning from ${escapeHtml(businessName)}</h1>
${sections
  .map(
    (section) => `<h2 style="font-size:18px;margin:24px 0 4px">${escapeHtml(section.title)}</h2>
<p style="margin:0 0 8px;color:#5b514c">${escapeHtml(section.intro)}</p>
<ul style="margin:0 0 12px;padding-left:20px">${section.lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
<p style="margin:0"><a href="${escapeHtml(section.link)}" style="display:inline-block;background:#B9532A;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:999px;font-weight:bold">${escapeHtml(section.linkText)}</a></p>`,
  )
  .join('\n')}
</div>`
  return { subject, text, html }
}

// Sends through Resend's HTTP API. Resolves to the email id, or throws with Resend's reason.
export async function sendEmail({ apiKey, to, from, subject, text, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, text, html }),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new Error(`Resend refused the email (${response.status}): ${data?.message ?? 'no reason given'}`)
  return data?.id ?? null
}

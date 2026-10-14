import { timingSafeEqual } from 'node:crypto'
import { sentCollection } from '../_lib/celebrations.js'
import { customersCollection } from '../_lib/customers.js'
import { buildDigest, renderDigest, sendEmail } from '../_lib/digest.js'
import { HttpError, route } from '../_lib/http.js'
import { leadsCollection } from '../_lib/leads.js'
import { ordersCollection } from '../_lib/orders.js'

const BUSINESS_NAME = 'Toylad Concept'
// Resend's shared sender. It can only email the address the Resend account was opened with.
const DEFAULT_FROM = `${BUSINESS_NAME} <onboarding@resend.dev>`

// Vercel Cron calls this with "Authorization: Bearer <CRON_SECRET>". Without a secret set, nobody gets in.
function authorised(req) {
  const secret = process.env.CRON_SECRET ?? ''
  const given = Buffer.from(String(req.headers.authorization ?? ''))
  const expected = Buffer.from(`Bearer ${secret}`)
  return secret.length >= 16 && given.length === expected.length && timingSafeEqual(given, expected)
}

// Runs once a day (see "crons" in vercel.json). Sends the owner's morning email when there is something to do.
export default route({
  async GET(req) {
    if (!authorised(req)) throw new HttpError(401, 'Not allowed.')

    const { RESEND_API_KEY, OWNER_EMAIL } = process.env
    if (!RESEND_API_KEY || !OWNER_EMAIL) return { sent: false, reason: 'RESEND_API_KEY and OWNER_EMAIL are not set.' }

    const [customers, orders, leads, sent] = await Promise.all(
      [await customersCollection(), await ordersCollection(), await leadsCollection(), await sentCollection()].map((collection) => collection.find({}).limit(10000).toArray()),
    )
    const digest = buildDigest({ customers, orders, leads, sent })
    const counts = { celebrations: digest.celebrations.length, followUps: digest.followUps.length, feedback: digest.feedback.length }
    if (digest.total === 0) return { sent: false, reason: 'Nothing to report today.', counts }

    const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? req.headers['x-forwarded-host'] ?? req.headers.host
    const email = renderDigest(digest, `https://${host}/admin`, BUSINESS_NAME)
    const id = await sendEmail({ apiKey: RESEND_API_KEY, to: OWNER_EMAIL, from: process.env.RESEND_FROM || DEFAULT_FROM, ...email })
    return { sent: true, id, counts }
  },
})

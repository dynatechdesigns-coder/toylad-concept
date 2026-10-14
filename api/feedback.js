import { customersCollection } from './_lib/customers.js'
import { feedbackCollection, feedbackValidators, publishedFilter, toReview } from './_lib/feedback.js'
import { HttpError, readJson, route } from './_lib/http.js'
import { ordersCollection } from './_lib/orders.js'
import { rateLimiter } from './_lib/rateLimit.js'
import { objectId, pickFields } from './_lib/validate.js'

const MAX_REVIEWS = 6
const tooManyPosts = rateLimiter({ windowMs: 10 * 60 * 1000, max: 5 })
const tooManyLookups = rateLimiter({ windowMs: 10 * 60 * 1000, max: 30 })
const isId = (value) => typeof value === 'string' && /^[0-9a-f]{24}$/i.test(value)

// The delivered order behind a personal feedback link (/feedback?o=<orderId>), with its customer.
async function orderFor(id) {
  if (!isId(id)) return null
  const order = await (await ordersCollection()).findOne({ _id: objectId(id), status: 'delivered' })
  if (!order?.customerId) return null
  const customer = await (await customersCollection()).findOne({ _id: order.customerId })
  return customer ? { order, customer } : null
}

// Public. GET: the approved reviews for the website, or (with ?o=) the name to pre-fill. POST: leave a review.
export default route({
  async GET(req) {
    if (req.query.o !== undefined) {
      if (tooManyLookups(req)) throw new HttpError(429, 'Too many requests. Please try again in a few minutes.')
      // An unknown link simply pre-fills nothing; it never says whether an order exists.
      return { name: (await orderFor(req.query.o))?.customer.name ?? '' }
    }
    const feedback = await feedbackCollection()
    const docs = await feedback.find(publishedFilter).sort({ createdAt: -1 }).limit(MAX_REVIEWS).toArray()
    return { reviews: docs.map(toReview) }
  },

  async POST(req, res) {
    const { website, orderId, ...body } = readJson(req)
    // Honeypot: people never see this field, so anything in it came from a bot. Pretend it worked.
    if (website) return { ok: true }
    if (tooManyPosts(req)) throw new HttpError(429, 'Too many requests. Please try again in a few minutes.')

    const fields = pickFields(body, feedbackValidators, { allowed: ['name', 'phone', 'rating', 'comment', 'canPublish'], required: ['name', 'rating'] })
    const doc = { name: fields.name, rating: fields.rating, comment: fields.comment ?? '', canPublish: fields.canPublish === true, approved: false, createdAt: new Date() }
    if (fields.phone) doc.phone = fields.phone

    // Link the review to its order and customer when it came from a personal link, or to a customer by phone.
    const linked = await orderFor(orderId)
    if (linked) {
      doc.orderId = linked.order._id
      doc.customerId = linked.customer._id
      if (linked.order.occasion) doc.occasion = linked.order.occasion
    } else if (fields.phone) {
      const customer = await (await customersCollection()).findOne({ phone: fields.phone })
      if (customer) doc.customerId = customer._id
    }

    await (await feedbackCollection()).insertOne(doc)
    res.statusCode = 201
    return { ok: true }
  },
})

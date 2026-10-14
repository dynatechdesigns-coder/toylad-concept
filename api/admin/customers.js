import { sentCollection } from '../_lib/celebrations.js'
import { customerValidators, customersCollection, toCustomer } from '../_lib/customers.js'
import { HttpError, readJson, route } from '../_lib/http.js'
import { leadsCollection, toLead } from '../_lib/leads.js'
import { ordersCollection, toOrder } from '../_lib/orders.js'
import { objectId, pickFields, text, toUpdate } from '../_lib/validate.js'

// One function for the whole resource: the list, and one customer with ?id=… (to stay within Vercel's function limit).
const notFound = () => new HttpError(404, 'That customer no longer exists.')
const validators = { ...customerValidators, addNote: text('The note', { max: 1000, required: true }) }

export default route(
  {
    async GET(req) {
      const customers = await customersCollection()
      // Without an id: every customer, most recently in touch first. The admin page searches this list in the browser.
      if (!req.query.id) {
        const docs = await customers.find({}).sort({ lastContactAt: -1 }).limit(2000).toArray()
        return { customers: docs.map(toCustomer) }
      }

      // With an id: that customer with all their enquiries and orders, newest first.
      const _id = objectId(req.query.id)
      const customer = await customers.findOne({ _id })
      if (!customer) throw notFound()
      const leads = await (await leadsCollection()).find({ customerId: _id }).sort({ createdAt: -1 }).toArray()
      const orders = await (await ordersCollection()).find({ customerId: _id }).sort({ orderDate: -1 }).toArray()
      return {
        customer: toCustomer(customer),
        leads: leads.map((lead) => toLead(lead, customer)),
        orders: orders.map((order) => toOrder(order, customer)),
      }
    },

    async PATCH(req) {
      const _id = objectId(req.query.id)
      const { addNote, ...fields } = pickFields(readJson(req), validators, {
        allowed: ['name', 'phone', 'email', 'birthday', 'anniversary', 'marketingConsent', 'notes', 'addNote'],
      })
      if (!addNote && Object.keys(fields).length === 0) throw new HttpError(400, 'Nothing to change.')

      const customers = await customersCollection()
      const current = await customers.findOne({ _id })
      if (!current) throw notFound()

      const now = new Date()
      // Consent keeps the date it was given; withdrawing it clears the date.
      if (fields.marketingConsent === true && !current.marketingConsent) fields.consentDate = now
      if (fields.marketingConsent === false) fields.consentDate = null
      // A quick note goes on top of the existing notes, with today's date.
      if (addNote) {
        const base = fields.notes ?? current.notes ?? ''
        fields.notes = `${now.toISOString().slice(0, 10)}: ${addNote}${base ? `\n${base}` : ''}`.slice(0, 5000)
        fields.lastContactAt = now
      }
      if (fields.notes === null) fields.notes = ''

      try {
        const doc = await customers.findOneAndUpdate({ _id }, toUpdate(fields), { returnDocument: 'after' })
        if (!doc) throw notFound()
        return { customer: toCustomer(doc) }
      } catch (error) {
        if (error?.code === 11000) throw new HttpError(409, 'Another customer already has this phone number.')
        throw error
      }
    },

    // Removes the customer and every enquiry of theirs, to honour a deletion request. Their orders stay
    // for the sales records, but with nothing that identifies them: no customer link and no notes.
    async DELETE(req) {
      const _id = objectId(req.query.id)
      const customers = await customersCollection()
      if (!(await customers.findOne({ _id }))) throw notFound()
      const { deletedCount } = await (await leadsCollection()).deleteMany({ customerId: _id })
      const kept = await (await ordersCollection()).updateMany({ customerId: _id }, { $set: { notes: '', updatedAt: new Date() }, $unset: { customerId: '', leadId: '' } })
      await (await sentCollection()).deleteMany({ customerId: _id })
      await customers.deleteOne({ _id })
      return { deleted: true, enquiriesDeleted: deletedCount, ordersKept: kept.modifiedCount }
    },
  },
  { auth: true },
)

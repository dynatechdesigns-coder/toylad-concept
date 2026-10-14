import { customerValidators, customersCollection, saveCustomerFromEnquiry } from '../_lib/customers.js'
import { HttpError, readJson, route } from '../_lib/http.js'
import { OPEN_STATUSES, followUpDate, leadValidators, leadsCollection, newLead, toLead } from '../_lib/leads.js'
import { objectId, pickFields, toUpdate } from '../_lib/validate.js'

// One function for the whole resource (to stay within Vercel's function limit).

const validators = { ...customerValidators, ...leadValidators }

export default route(
  {
    // Prospects: enquiries not yet delivered or lost, newest first. `?scope=all` returns every enquiry.
    async GET(req) {
      const leads = await leadsCollection()
      const filter = req.query.scope === 'all' ? {} : { status: { $in: OPEN_STATUSES } }
      const docs = await leads.find(filter).sort({ createdAt: -1 }).limit(1000).toArray()

      const customers = await customersCollection()
      const owners = await customers.find({ _id: { $in: docs.map((doc) => doc.customerId) } }).toArray()
      const byId = new Map(owners.map((customer) => [String(customer._id), customer]))
      return { leads: docs.map((doc) => toLead(doc, byId.get(String(doc.customerId)))) }
    },

    // An enquiry the owner records herself (WhatsApp, phone or walk-in).
    async POST(req, res) {
      const fields = pickFields(readJson(req), validators, {
        allowed: ['name', 'phone', 'service', 'package', 'eventDate', 'guests', 'details', 'source'],
        required: ['name', 'phone', 'service', 'source'],
      })
      const customer = await saveCustomerFromEnquiry(await customersCollection(), fields)
      const leads = await leadsCollection()
      const doc = newLead(customer._id, fields, fields.source)
      const { insertedId } = await leads.insertOne(doc)
      res.statusCode = 201
      return { lead: toLead({ ...doc, _id: insertedId }, customer) }
    },

    // Change one enquiry (?id=…): its status, or its follow-up date.
    async PATCH(req) {
      const _id = objectId(req.query.id)
      const fields = pickFields(readJson(req), leadValidators, {
        allowed: ['status', 'lostReason', 'followUpAt', 'service', 'package', 'eventDate', 'guests', 'details'],
      })
      if (Object.keys(fields).length === 0) throw new HttpError(400, 'Nothing to change.')

      if (fields.status) {
        if (fields.status === 'lost' && !fields.lostReason) throw new HttpError(400, 'Please choose why it was lost.')
        if (fields.status !== 'lost') fields.lostReason = null
        // A quote starts a fresh two-day wait; a finished enquiry needs no follow-up.
        if (fields.followUpAt === undefined) fields.followUpAt = fields.status === 'quoted' ? followUpDate() : null
      } else if (fields.lostReason !== undefined) {
        throw new HttpError(400, 'A reason can only be saved together with the "lost" status.')
      }

      const leads = await leadsCollection()
      const now = new Date()
      const doc = await leads.findOneAndUpdate({ _id }, toUpdate(fields, { updatedAt: now }), { returnDocument: 'after' })
      if (!doc) throw new HttpError(404, 'That enquiry no longer exists.')

      const customers = await customersCollection()
      // Setting a follow-up date means she has just been in touch with the customer.
      if (fields.followUpAt) await customers.updateOne({ _id: doc.customerId }, { $set: { lastContactAt: now } })
      return { lead: toLead(doc, await customers.findOne({ _id: doc.customerId })) }
    },
  },
  { auth: true },
)

import { customerValidators, customersCollection, saveCustomerFromEnquiry } from '../../_lib/customers.js'
import { readJson, route } from '../../_lib/http.js'
import { OPEN_STATUSES, leadValidators, leadsCollection, newLead, toLead } from '../../_lib/leads.js'
import { pickFields } from '../../_lib/validate.js'

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
  },
  { auth: true },
)

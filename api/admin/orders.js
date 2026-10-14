import { customerValidators, customersCollection, saveCustomerFromEnquiry } from '../_lib/customers.js'
import { HttpError, readJson, route } from '../_lib/http.js'
import { leadsCollection } from '../_lib/leads.js'
import { checkDeposit, orderValidators, ordersCollection, toOrder, todayInNigeria } from '../_lib/orders.js'
import { objectId, pickFields, toUpdate } from '../_lib/validate.js'

// One function for the whole resource (list, create, and edit with ?id=…), to stay within Vercel's function limit.
const fieldNames = ['items', 'amount', 'deposit', 'orderDate', 'deliveryDate', 'occasion', 'notes']

// The customer for a new order: an existing one by id, or a new one by name and phone.
async function findCustomer(customers, { customerId, newCustomer }) {
  if (customerId) {
    const customer = await customers.findOne({ _id: objectId(customerId) })
    if (!customer) throw new HttpError(400, 'That customer no longer exists. Please choose again.')
    return customer
  }
  if (!newCustomer || typeof newCustomer !== 'object') throw new HttpError(400, 'Please choose a customer.')
  const details = pickFields(newCustomer, customerValidators, { allowed: ['name', 'phone'], required: ['name', 'phone'] })
  return saveCustomerFromEnquiry(customers, details)
}

export default route(
  {
    // Every order with its customer's name and phone. The admin page sorts and groups them.
    async GET() {
      const orders = await ordersCollection()
      const docs = await orders.find({}).sort({ deliveryDate: -1 }).limit(5000).toArray()
      const customers = await customersCollection()
      const owners = await customers.find({ _id: { $in: docs.map((doc) => doc.customerId).filter(Boolean) } }).toArray()
      const byId = new Map(owners.map((customer) => [String(customer._id), customer]))
      return { orders: docs.map((doc) => toOrder(doc, byId.get(String(doc.customerId)))) }
    },

    async POST(req, res) {
      const { customerId, newCustomer, leadId, ...body } = readJson(req)
      const fields = pickFields(body, orderValidators, { allowed: fieldNames, required: ['items', 'amount', 'deliveryDate'] })
      checkDeposit(fields.amount, fields.deposit)

      const customers = await customersCollection()
      const customer = await findCustomer(customers, { customerId, newCustomer })
      const now = new Date()
      const doc = { customerId: customer._id, status: 'confirmed', notes: '', createdAt: now, updatedAt: now }
      for (const [key, value] of Object.entries(fields)) if (value !== null) doc[key] = value
      doc.orderDate ??= todayInNigeria()

      // An order made from a prospect confirms that enquiry.
      if (leadId) {
        const leads = await leadsCollection()
        const lead = await leads.findOneAndUpdate(
          { _id: objectId(leadId), customerId: customer._id },
          { $set: { status: 'confirmed', updatedAt: now }, $unset: { lostReason: '', followUpAt: '' } },
        )
        if (!lead) throw new HttpError(400, 'That enquiry no longer exists.')
        doc.leadId = lead._id
      }

      const orders = await ordersCollection()
      const { insertedId } = await orders.insertOne(doc)
      await customers.updateOne({ _id: customer._id }, { $set: { lastContactAt: now } })
      res.statusCode = 201
      return { order: toOrder({ ...doc, _id: insertedId }, customer) }
    },

    async PATCH(req) {
      const _id = objectId(req.query.id)
      const fields = pickFields(readJson(req), orderValidators, { allowed: [...fieldNames, 'status'] })
      if (Object.keys(fields).length === 0) throw new HttpError(400, 'Nothing to change.')
      for (const key of ['items', 'amount', 'deliveryDate', 'orderDate']) {
        if (fields[key] === null) throw new HttpError(400, 'That detail cannot be left empty.')
      }

      const orders = await ordersCollection()
      const current = await orders.findOne({ _id })
      if (!current) throw new HttpError(404, 'That order no longer exists.')
      const deposit = fields.deposit === undefined ? current.deposit : fields.deposit
      checkDeposit(fields.amount ?? current.amount, deposit)
      if (fields.notes === null) fields.notes = ''

      const doc = await orders.findOneAndUpdate({ _id }, toUpdate(fields, { updatedAt: new Date() }), { returnDocument: 'after' })
      const customer = doc.customerId ? await (await customersCollection()).findOne({ _id: doc.customerId }) : null
      return { order: toOrder(doc, customer) }
    },
  },
  { auth: true },
)

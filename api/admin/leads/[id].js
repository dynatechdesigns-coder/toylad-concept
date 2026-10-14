import { customersCollection } from '../../_lib/customers.js'
import { HttpError, readJson, route } from '../../_lib/http.js'
import { followUpDate, leadValidators, leadsCollection, toLead } from '../../_lib/leads.js'
import { objectId, pickFields, toUpdate } from '../../_lib/validate.js'

export default route(
  {
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

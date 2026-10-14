import { customersCollection, toCustomer } from '../../_lib/customers.js'
import { route } from '../../_lib/http.js'

// Every customer, most recently in touch first. The admin page searches this list in the browser.
export default route(
  {
    async GET() {
      const customers = await customersCollection()
      const docs = await customers.find({}).sort({ lastContactAt: -1 }).limit(2000).toArray()
      return { customers: docs.map(toCustomer) }
    },
  },
  { auth: true },
)

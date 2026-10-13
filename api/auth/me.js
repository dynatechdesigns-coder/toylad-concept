import { hasSession } from '../_lib/auth.js'
import { route } from '../_lib/http.js'

export default route({
  async GET(req) {
    return { authenticated: await hasSession(req) }
  },
})

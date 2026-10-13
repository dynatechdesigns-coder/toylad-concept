import { clearSessionCookie } from '../_lib/auth.js'
import { route } from '../_lib/http.js'

export default route({
  POST(req, res) {
    res.setHeader('Set-Cookie', clearSessionCookie())
    return { authenticated: false }
  },
})

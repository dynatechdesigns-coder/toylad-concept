const KEY = 'toylad-owner'

// A plain yes/no flag (not a secret) saying "this browser has logged in as the owner".
// The public site only asks the server about the session when it is set, so visitors never do.
export function rememberOwner(isOwner) {
  try {
    if (isOwner) localStorage.setItem(KEY, '1')
    else localStorage.removeItem(KEY)
  } catch {
    // Storage can be blocked (private mode); owner mode on the public site is then skipped.
  }
}

export function mayBeOwner() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

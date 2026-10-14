import { useEffect, useState } from 'react'
import { mayBeOwner, rememberOwner } from '../utils/ownerHint'

// True only when the server confirms the owner's session. Visitors skip the request entirely.
export default function useOwnerSession() {
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    if (!mayBeOwner()) return undefined
    let active = true
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!active || !data) return
        const authenticated = data.authenticated === true
        if (!authenticated) rememberOwner(false)
        setIsOwner(authenticated)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return [isOwner, setIsOwner]
}

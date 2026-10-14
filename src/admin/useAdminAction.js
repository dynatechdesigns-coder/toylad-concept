import { useState } from 'react'

// Runs one admin request at a time: tracks `busy`, keeps the last error message, and ends the
// session when the server says the login has expired. `run` resolves to the result, or false on failure.
export default function useAdminAction(onSessionExpired) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const run = async (action) => {
    setBusy(true)
    setError('')
    try {
      return (await action()) ?? true
    } catch (problem) {
      if (problem.status === 401) onSessionExpired()
      else setError(problem.message)
      return false
    } finally {
      setBusy(false)
    }
  }

  return { run, busy, error, clearError: () => setError('') }
}

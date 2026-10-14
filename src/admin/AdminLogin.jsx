import { useState } from 'react'
import { LogIn } from 'lucide-react'
import Logo from '../components/layout/Logo'
import Button from '../components/ui/Button'
import AdminField from './AdminField'
import { login } from './api'
import { controlClass } from './fieldStyles'

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!password) {
      setError('Please enter your password.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await login(password)
      onSuccess()
    } catch (problem) {
      setError(problem.message)
      setBusy(false)
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-espresso/10 bg-butter-soft p-6 shadow-sm md:p-10">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="mt-8 text-center text-sm font-semibold uppercase tracking-widest text-navy">Owner area</p>
        <h1 className="mt-3 text-center text-3xl font-semibold md:text-4xl">Welcome back</h1>
        <p className="mt-3 text-center text-base leading-relaxed text-espresso/75 md:text-lg">
          Enter your password to manage your photos.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-8">
          <AdminField id="admin-password" label="Password" error={error}>
            <input
              id="admin-password"
              type="password"
              value={password}
              required
              autoFocus
              autoComplete="current-password"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'admin-password-error' : undefined}
              onChange={(event) => setPassword(event.target.value)}
              className={controlClass(error)}
            />
          </AdminField>
          <Button type="submit" size="lg" icon={LogIn} disabled={busy} className="mt-6 min-h-14 w-full">
            {busy ? 'Logging in…' : 'Log in'}
          </Button>
        </form>
      </div>
    </main>
  )
}

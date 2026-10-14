import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import AdminLogin from './AdminLogin'
import AdminPhotos from './AdminPhotos'
import { rememberOwner } from '../utils/ownerHint'
import { getSession, logout } from './api'

// Dashboard sections. Add customers, orders and feedback here later, each with its own screen component.
const sections = [{ id: 'photos', label: 'Photos', Screen: AdminPhotos }]

export default function AdminApp() {
  // 'checking' | 'out' | 'in'
  const [session, setSessionState] = useState('checking')
  // Also remembers the answer, so the public site knows whether to offer owner mode.
  const setSession = (next) => {
    rememberOwner(next === 'in')
    setSessionState(next)
  }
  const [sectionId, setSectionId] = useState(sections[0].id)

  useEffect(() => {
    // Keep the admin area out of search results.
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.append(robots)
    const publicTitle = document.title
    document.title = 'Admin | Toylad Concept'

    getSession()
      .then((data) => setSession(data.authenticated ? 'in' : 'out'))
      .catch(() => setSession('out'))

    return () => {
      robots.remove()
      document.title = publicTitle
    }
  }, [])

  if (session === 'checking') {
    return (
      <p role="status" className="flex min-h-dvh items-center justify-center bg-cream text-lg text-espresso/75">
        Loading…
      </p>
    )
  }
  if (session === 'out') return <AdminLogin onSuccess={() => setSession('in')} />

  const { Screen } = sections.find((section) => section.id === sectionId)
  const onLogout = () => {
    // Leave the screen even if the request fails; the cookie expires on its own.
    logout().catch(() => {})
    setSession('out')
  }

  return (
    <AdminLayout sections={sections} sectionId={sectionId} onSectionChange={setSectionId} onLogout={onLogout}>
      <Screen onSessionExpired={() => setSession('out')} />
    </AdminLayout>
  )
}

import { useEffect, useState } from 'react'
import AdminCelebrations from './AdminCelebrations'
import AdminCustomers from './AdminCustomers'
import AdminLayout from './AdminLayout'
import AdminOrders from './AdminOrders'
import AdminLogin from './AdminLogin'
import AdminPhotos from './AdminPhotos'
import AdminProspects from './AdminProspects'
import AdminReports from './AdminReports'
import CelebrationsSummary from './CelebrationsSummary'
import { rememberOwner } from '../utils/ownerHint'
import { getSession, logout } from './api'

// Dashboard sections, one tab each. Add feedback here later, with its own screen component.
const sections = [
  { id: 'photos', label: 'Photos', Screen: AdminPhotos },
  { id: 'prospects', label: 'Prospects', Screen: AdminProspects },
  { id: 'orders', label: 'Orders', Screen: AdminOrders },
  { id: 'customers', label: 'Customers', Screen: AdminCustomers },
  { id: 'celebrations', label: 'Celebrations', Screen: AdminCelebrations },
  { id: 'reports', label: 'Reports', Screen: AdminReports },
]

export default function AdminApp() {
  // 'checking' | 'out' | 'in'
  const [session, setSessionState] = useState('checking')
  // Also remembers the answer, so the public site knows whether to offer owner mode.
  const setSession = (next) => {
    rememberOwner(next === 'in')
    setSessionState(next)
  }
  // The tab can be opened directly with a link such as /admin#prospects (the morning email uses these).
  const [sectionId, setSectionState] = useState(() => sections.find((section) => `#${section.id}` === window.location.hash)?.id ?? sections[0].id)
  const setSectionId = (id) => {
    window.history.replaceState(null, '', `#${id}`)
    setSectionState(id)
    window.scrollTo({ top: 0 })
  }

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
      {sectionId === sections[0].id && <CelebrationsSummary onOpen={() => setSectionId('celebrations')} />}
      <Screen onSessionExpired={() => setSession('out')} />
    </AdminLayout>
  )
}

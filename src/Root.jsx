import { Suspense, lazy } from 'react'
import App from './App.jsx'

// The owner's admin area lives at /admin and loads only there, so the public site stays light.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))
const isAdmin = /^\/admin(\/|$)/.test(window.location.pathname)

export default function Root() {
  if (!isAdmin) return <App />

  return (
    <Suspense fallback={null}>
      <AdminApp />
    </Suspense>
  )
}

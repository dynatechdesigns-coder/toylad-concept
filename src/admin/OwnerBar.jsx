import { rememberOwner } from '../utils/ownerHint'
import { logout } from './api'

const link =
  'inline-flex min-h-11 items-center rounded-full px-1 text-sm font-semibold text-cream underline decoration-butter underline-offset-4 transition duration-300 ease-out hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-butter motion-reduce:transition-none'

// Small floating bar the logged-in owner sees on the public site. Sits clear of the WhatsApp button.
export default function OwnerBar({ onSignedOut }) {
  const signOut = () => {
    // Leave owner mode even if the request fails; the cookie expires on its own.
    logout().catch(() => {})
    rememberOwner(false)
    onSignedOut()
  }

  return (
    <aside
      aria-label="Owner mode"
      className="fixed bottom-4 left-4 z-40 flex max-w-[calc(100vw-6.5rem)] animate-pop-in flex-wrap items-center gap-x-4 rounded-3xl bg-navy px-4 py-1 shadow-xl sm:bottom-6 sm:left-6"
    >
      <p className="flex min-h-11 items-center gap-2 text-sm font-semibold text-cream">
        <span className="size-3 rounded-full bg-butter" aria-hidden="true" />
        Owner mode
      </p>
      <a href="/admin" className={link}>
        Manage photos
      </a>
      <button type="button" onClick={signOut} className={link}>
        Log out
      </button>
    </aside>
  )
}

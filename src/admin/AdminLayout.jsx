import { ExternalLink, LogOut } from 'lucide-react'
import Logo from '../components/layout/Logo'
import Container from '../components/ui/Container'
import { actionButton } from './fieldStyles'

// Header shared by every admin screen. The section tabs appear once there is more than one section.
export default function AdminLayout({ sections, sectionId, onSectionChange, onLogout, children }) {
  return (
    <div className="min-h-dvh bg-cream">
      <header className="border-b border-espresso/10 bg-butter-soft">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-4">
          <Logo />
          <div className="flex flex-wrap gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className={actionButton}>
              <ExternalLink className="size-5" aria-hidden="true" />
              View website
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <button type="button" onClick={onLogout} className={actionButton}>
              <LogOut className="size-5" aria-hidden="true" />
              Log out
            </button>
          </div>
        </Container>

        {sections.length > 1 && (
          <Container>
            <nav aria-label="Admin sections" className="flex gap-2 overflow-x-auto pb-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  aria-current={section.id === sectionId ? 'page' : undefined}
                  onClick={() => onSectionChange(section.id)}
                  className={`${actionButton} shrink-0 aria-[current=page]:border-navy aria-[current=page]:bg-navy aria-[current=page]:text-white`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </Container>
        )}
      </header>

      <main>
        <Container className="py-8 md:py-12">{children}</Container>
      </main>
    </div>
  )
}

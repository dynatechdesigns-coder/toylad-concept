import { useEffect, useRef } from 'react'
import { ArrowLeft, LogOut } from 'lucide-react'
import Logo from '../components/layout/Logo'
import Container from '../components/ui/Container'
import site from '../data/site'
import { actionButton } from './fieldStyles'

const tab =
  'inline-flex min-h-11 shrink-0 items-center rounded-full border px-5 text-sm font-semibold transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal motion-reduce:transition-none'

// Header shared by every admin screen, styled like the public navbar. One tab per dashboard section.
export default function AdminLayout({ sections, sectionId, onSectionChange, onLogout, children }) {
  const navRef = useRef(null)

  // With several tabs the bar scrolls sideways on a phone: keep the chosen tab in view.
  useEffect(() => {
    navRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [sectionId])

  return (
    <div className="min-h-dvh bg-cream">
      <header className="sticky top-0 z-40 bg-cream/90 shadow-sm backdrop-blur">
        <Container className="flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2 lg:min-h-20">
          <Logo href="/" />
          <div className="flex gap-2">
            <a href="/" className={actionButton}>
              <ArrowLeft className="size-5" aria-hidden="true" />
              Back to website
            </a>
            <button type="button" onClick={onLogout} className={actionButton}>
              <LogOut className="size-5" aria-hidden="true" />
              Log out
            </button>
          </div>
        </Container>

        <Container>
          <nav ref={navRef} aria-label="Admin sections" className="flex gap-3 overflow-x-auto pb-3 pt-1 [scrollbar-width:none]">
            {sections.map((section) => {
              const active = section.id === sectionId
              return (
                <button
                  key={section.id}
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  onClick={() => onSectionChange(section.id)}
                  className={`${tab} ${
                    active
                      ? 'border-terracotta-deep bg-terracotta-deep text-white'
                      : 'border-espresso/20 text-espresso hover:border-teal hover:text-navy'
                  }`}
                >
                  {section.label}
                </button>
              )
            })}
          </nav>
        </Container>
      </header>

      <main>
        <h1 className="sr-only">{site.name} admin</h1>
        <Container className="py-12 md:py-16">{children}</Container>
      </main>
    </div>
  )
}

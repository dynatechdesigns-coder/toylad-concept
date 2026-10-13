import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navCta, navLinks } from '../../data/navigation'
import useScrollSpy from '../../hooks/useScrollSpy'
import useScrolled from '../../hooks/useScrolled'
import Button from '../ui/Button'
import Container from '../ui/Container'
import Logo from './Logo'
import MobileMenu from './MobileMenu'

const sectionIds = navLinks.map((link) => link.id)
const menuId = 'mobile-menu'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled(20)
  const activeId = useScrollSpy(sectionIds)
  const headerRef = useRef(null)
  const toggleRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const close = () => setOpen(false)
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      close()
      toggleRef.current?.focus()
    }
    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) close()
    }
    const desktop = window.matchMedia('(min-width: 1024px)')

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    desktop.addEventListener('change', close)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      desktop.removeEventListener('change', close)
      document.body.style.overflow = ''
    }
  }, [open])

  const surface = scrolled || open ? 'bg-cream/90 shadow-sm backdrop-blur' : 'bg-transparent'

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ease-out motion-reduce:transition-none ${surface}`}
    >
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-20">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const active = link.id === activeId
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={active ? 'location' : undefined}
                    className={`inline-flex min-h-11 items-center rounded-full text-sm font-medium underline-offset-8 transition duration-300 ease-out hover:text-terracotta-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal motion-reduce:transition-none ${
                      active ? 'text-terracotta-deep underline decoration-terracotta decoration-2' : 'text-espresso'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <Button href={navCta.href} size="sm" className="hidden min-h-11 lg:inline-flex">
          {navCta.label}
        </Button>

        <button
          ref={toggleRef}
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex size-11 items-center justify-center rounded-full text-espresso transition duration-300 ease-out hover:bg-butter-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal motion-reduce:transition-none lg:hidden"
        >
          {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        </button>
      </Container>

      <MobileMenu
        id={menuId}
        open={open}
        links={navLinks}
        activeId={activeId}
        cta={navCta}
        onNavigate={() => setOpen(false)}
      />
    </header>
  )
}

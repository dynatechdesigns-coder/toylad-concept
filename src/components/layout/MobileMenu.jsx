import Button from '../ui/Button'
import Container from '../ui/Container'

export default function MobileMenu({ id, open, links, activeId, cta, onNavigate }) {
  const state = open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-4 opacity-0'

  return (
    <div
      id={id}
      className={`absolute inset-x-0 top-full max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-espresso/10 bg-cream shadow-xl transition-[opacity,translate,visibility] duration-300 ease-out motion-reduce:transition-none lg:hidden ${state}`}
    >
      <Container className="py-6">
        <ul className="space-y-1">
          {links.map((link) => {
            const active = link.id === activeId
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={onNavigate}
                  aria-current={active ? 'location' : undefined}
                  className={`block rounded-2xl px-4 py-4 text-lg font-medium transition duration-300 ease-out hover:bg-butter-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal motion-reduce:transition-none ${
                    active ? 'bg-butter text-espresso hover:bg-butter' : 'text-espresso'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>
        <Button href={cta.href} size="lg" onClick={onNavigate} className="mt-6 w-full">
          {cta.label}
        </Button>
      </Container>
    </div>
  )
}

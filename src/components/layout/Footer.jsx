import { ArrowUp } from 'lucide-react'
import { navLinks } from '../../data/navigation'
import services from '../../data/services'
import site from '../../data/site'
import Container from '../ui/Container'
import SocialIcon from '../ui/SocialIcon'
import FooterContact from './FooterContact'
import Logo from './Logo'

const heading = 'font-sans text-sm font-semibold uppercase tracking-widest text-cream'
const link =
  'inline-flex min-h-11 items-center rounded-full text-cream/80 transition duration-300 ease-out decoration-butter underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-butter motion-reduce:transition-none'

const year = new Date().getFullYear()
const linkColumns = [
  { title: 'Quick Links', links: navLinks.map(({ id, label }) => ({ key: id, label, href: `#${id}` })) },
  { title: 'Services', links: services.map(({ id, title }) => ({ key: id, label: title, href: '#services' })) },
]

export default function Footer() {
  return (
    <footer id="contact" className="scroll-mt-24 bg-navy text-cream">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 md:py-20 lg:grid-cols-[1.5fr_1fr_1.2fr_1.5fr_1.3fr] lg:gap-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo tone="dark" />
          <p className="mt-4 max-w-xs text-base leading-relaxed text-cream/75">{site.tagline}</p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {site.socials.map(({ id, icon, label, url }) => (
              <li key={id}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.name} on ${label} (opens in a new tab)`}
                  title={label}
                  className="flex size-11 items-center justify-center rounded-full border border-cream/20 text-cream transition duration-300 ease-out hover:border-butter hover:bg-butter hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-butter motion-reduce:transition-none"
                >
                  <SocialIcon name={icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {linkColumns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h3 className={heading}>{column.title}</h3>
            <ul className="mt-4">
              {column.links.map((item) => (
                <li key={item.key}>
                  <a href={item.href} className={link}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <FooterContact />
      </Container>

      <div className="border-t border-cream/10">
        {/* Extra bottom padding keeps the floating WhatsApp button off these controls. */}
        <Container className="flex flex-col items-center justify-between gap-4 pb-24 pt-6 text-sm text-cream/70 sm:flex-row 2xl:pb-6">
          <p className="text-center sm:text-left">
            © {year} {site.name}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0 })}
            className={`${link} gap-2 font-semibold`}
          >
            Back to top
            <ArrowUp className="size-4" aria-hidden="true" />
          </button>
        </Container>
      </div>
    </footer>
  )
}

import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import site from '../../data/site'

const heading = 'font-sans text-sm font-semibold uppercase tracking-widest text-cream'
const link =
  'inline-flex min-h-11 items-center gap-3 rounded-full text-cream/80 transition duration-300 ease-out decoration-butter underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-butter motion-reduce:transition-none'

const contactLinks = [
  { label: site.phone, href: `tel:${site.phone.replace(/[^\d+]/g, '')}`, icon: Phone },
  { label: site.email, href: `mailto:${site.email}`, icon: Mail },
]

export default function FooterContact() {
  return (
    <>
      <div>
        <h3 className={heading}>Contact</h3>
        <ul className="mt-4">
          {contactLinks.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <a href={href} className={`${link} break-all`}>
                <Icon className="size-4 shrink-0 text-butter" aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
          <li className="flex items-start gap-3 py-2.5 text-cream/80">
            <MapPin className="mt-1 size-4 shrink-0 text-butter" aria-hidden="true" />
            <address className="not-italic">{site.address}</address>
          </li>
        </ul>
      </div>

      <div>
        <h3 className={heading}>Business Hours</h3>
        <dl className="mt-4 space-y-4">
          {site.hours.map(({ days, time }) => (
            <div key={days} className="flex items-start gap-3">
              <Clock className="mt-1 size-4 shrink-0 text-butter" aria-hidden="true" />
              <div>
                <dt className="font-medium text-cream">{days}</dt>
                <dd className="text-sm text-cream/70">{time}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </>
  )
}

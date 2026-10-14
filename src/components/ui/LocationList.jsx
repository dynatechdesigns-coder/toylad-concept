import { MapPin } from 'lucide-react'
import site from '../../data/site'
import { mapsUrl } from '../../utils/format'

// `tone` matches the background: "light" = cream, "dark" = navy.
const tones = {
  light: {
    label: 'text-espresso',
    address: 'text-espresso/75',
    icon: 'text-teal',
    link: 'text-teal hover:text-navy focus-visible:ring-teal',
  },
  dark: {
    label: 'text-cream',
    address: 'text-cream/70',
    icon: 'text-butter',
    link: 'text-cream decoration-butter hover:text-white focus-visible:ring-butter',
  },
}

export default function LocationList({ tone = 'light', className = '' }) {
  const styles = tones[tone]

  return (
    <ul className={`space-y-4 ${className}`}>
      {site.locations.map(({ id, label, name, address }) => (
        <li key={id} className="flex items-start gap-3">
          <MapPin className={`mt-1 size-4 shrink-0 ${styles.icon}`} aria-hidden="true" />
          <div>
            <p className={`font-medium ${styles.label}`}>{label}</p>
            <address className={`text-sm not-italic ${styles.address}`}>
              {name && <span className="block">{name}</span>}
              {address}
            </address>
            <a
              href={mapsUrl(address)}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11 items-center rounded-full text-sm font-semibold underline underline-offset-4 transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 motion-reduce:transition-none ${styles.link}`}
            >
              Get directions
              <span className="sr-only">
                {' '}
                to the {label} (opens in a new tab)
              </span>
            </a>
          </div>
        </li>
      ))}
    </ul>
  )
}

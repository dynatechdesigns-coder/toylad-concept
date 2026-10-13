/* global __HAS_LOGO__ */
import { Cake } from 'lucide-react'
import site from '../../data/site'

const [firstWord, ...otherWords] = site.name.split(' ')

// `tone="dark"` is for navy backgrounds (footer).
export default function Logo({ tone = 'light', className = '' }) {
  const dark = tone === 'dark'

  return (
    <a
      href="#top"
      aria-label={`${site.name} home`}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 ${dark ? 'focus-visible:ring-butter' : 'focus-visible:ring-teal'} ${className}`}
    >
      {__HAS_LOGO__ ? (
        <img src="/logo.svg" alt={`${site.name} logo`} className="h-10 w-auto" />
      ) : (
        <>
          <Cake className={`size-6 ${dark ? 'text-butter' : 'text-terracotta'}`} aria-hidden="true" />
          <span className="flex flex-col leading-none">
            <span className={`font-display text-2xl font-bold ${dark ? 'text-cream' : 'text-espresso'}`}>
              {firstWord}
            </span>
            <span
              className={`mt-1 text-[0.65rem] font-semibold uppercase tracking-widest ${dark ? 'text-cream/80' : 'text-terracotta-deep'}`}
            >
              {otherWords.join(' ')}
            </span>
          </span>
        </>
      )}
    </a>
  )
}

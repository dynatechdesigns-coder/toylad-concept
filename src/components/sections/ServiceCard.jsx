import { ArrowRight, Check } from 'lucide-react'

export default function ServiceCard({ service, setBookingPreset }) {
  const { id, icon: Icon, title, description, highlights } = service

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-espresso/10 bg-cream p-6 shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:border-terracotta hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-8">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-terracotta/10 text-terracotta-deep transition duration-300 ease-out group-hover:bg-teal group-hover:text-white motion-reduce:transition-none">
        <Icon className="size-7" strokeWidth={1.5} aria-hidden="true" />
      </span>

      <h3 className="mt-6 text-xl font-semibold md:text-2xl">{title}</h3>
      <p className="mt-3 text-base leading-relaxed text-espresso/75">{description}</p>

      <ul className="mb-8 mt-6 space-y-2">
        {highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-2 text-sm text-espresso/80">
            <Check className="mt-0.5 size-4 shrink-0 text-terracotta" aria-hidden="true" />
            {highlight}
          </li>
        ))}
      </ul>

      <a
        href="#booking"
        onClick={() => setBookingPreset({ service: id, package: null })}
        className="mt-auto inline-flex min-h-11 items-center gap-2 self-start rounded-full font-semibold text-terracotta-deep transition duration-300 ease-out hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal motion-reduce:transition-none"
      >
        Enquire<span className="sr-only"> about {title}</span>
        <ArrowRight
          className="size-4 transition duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          aria-hidden="true"
        />
      </a>
    </article>
  )
}

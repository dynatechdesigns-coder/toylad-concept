import hero from '../../data/hero'
import Button from '../ui/Button'
import Container from '../ui/Container'
import HeroCollage from './HeroCollage'

export default function Hero({ setBookingPreset }) {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[90svh] items-center overflow-hidden bg-cream pb-20 pt-28 md:pb-28 md:pt-36"
    >
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-butter/50 blur-3xl md:size-[32rem]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-24 bottom-0 -z-10 size-72 rounded-full bg-teal/10 blur-3xl md:size-96"
      />

      <Container className="grid w-full items-center gap-14 lg:grid-cols-2 lg:gap-8">
        <div>
          <p className="animate-fade-up text-sm font-semibold uppercase tracking-widest text-terracotta-deep">
            {hero.eyebrow}
          </p>
          <h1 className="mt-4 animate-fade-up text-4xl font-semibold leading-tight md:text-6xl md:leading-tight">
            {hero.title} <em className="italic text-terracotta">{hero.titleAccent}</em>
          </h1>
          <p className="mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-espresso/75 [animation-delay:150ms] md:text-lg">
            {hero.subtitle}
          </p>

          <div className="mt-8 flex animate-fade-up flex-col gap-4 [animation-delay:300ms] sm:flex-row">
            {hero.ctas.map((cta) => (
              <Button
                key={cta.service}
                href="#booking"
                variant={cta.variant}
                size="lg"
                icon={cta.icon}
                onClick={() => setBookingPreset({ service: cta.service, package: null })}
              >
                {cta.label}
              </Button>
            ))}
          </div>

          <ul className="mt-10 flex animate-fade-up flex-wrap gap-x-6 gap-y-3 [animation-delay:300ms]">
            {hero.trustPoints.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-medium text-espresso/80">
                <Icon className="size-4 text-terracotta" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <HeroCollage />
      </Container>
    </section>
  )
}

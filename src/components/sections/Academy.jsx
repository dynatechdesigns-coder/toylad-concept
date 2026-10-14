import { GraduationCap, MapPin } from 'lucide-react'
import site from '../../data/site'
import Container from '../ui/Container'
import WhatsAppLink from '../ui/WhatsAppLink'

const { academy } = site
const location = site.locations.find((item) => item.id === academy.locationId)

export default function Academy() {
  return (
    <section id="academy" aria-labelledby="academy-title" className="scroll-mt-24 bg-butter-soft py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-6 rounded-3xl border border-espresso/10 bg-cream p-6 shadow-sm md:flex-row md:items-center md:gap-8 md:p-10">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-terracotta/10 text-terracotta-deep">
            <GraduationCap className="size-7" strokeWidth={1.5} aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold uppercase tracking-widest text-terracotta-deep">{academy.eyebrow}</p>
            <h2 id="academy-title" className="mt-2 text-xl font-semibold md:text-2xl">
              {location.name}
            </h2>
            <p className="mt-2 text-base leading-relaxed text-espresso/75">{academy.text}</p>
            <p className="mt-3 flex items-start gap-2 text-sm text-espresso/75">
              <MapPin className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
              <span>
                <span className="font-semibold text-espresso">{location.label}:</span> {location.address}
              </span>
            </p>
          </div>

          <WhatsAppLink message={academy.whatsappMessage} className="w-full shrink-0 md:w-auto">
            {academy.cta}
          </WhatsAppLink>
        </div>
      </Container>
    </section>
  )
}

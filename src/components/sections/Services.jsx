import services from '../../data/services'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import ServiceCard from './ServiceCard'

export default function Services({ setBookingPreset }) {
  return (
    <section id="services" className="scroll-mt-24 bg-butter-soft py-20 md:py-28">
      <Container>
        <SectionHeading
          tone="soft"
          eyebrow="What We Do"
          title="Everything your celebration needs"
          subtitle="One team for the cake, the treats, the styling and the planning, so every detail feels like it belongs together."
        />
        <ul className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 md:gap-8 xl:grid-cols-4">
          {services.map((service) => (
            <li key={service.id}>
              <ServiceCard service={service} setBookingPreset={setBookingPreset} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

import { stats } from '../../data/stats'
import useSectionInView from '../../hooks/useSectionInView'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import StatCounter from './StatCounter'
import TestimonialCarousel from './TestimonialCarousel'

const statsId = 'stats'

export default function Testimonials() {
  const statsSeen = useSectionInView(statsId, { once: true, threshold: 0.3 })

  return (
    <section id="testimonials" className="scroll-mt-24 overflow-hidden bg-navy py-20 text-cream md:py-28">
      <Container>
        <SectionHeading
          tone="dark"
          eyebrow="Reviews"
          title="Loved by hosts and their guests"
          subtitle="The numbers we are proud of, and the kind words behind them."
        />

        <dl id={statsId} className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-16 md:gap-x-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCounter key={stat.id} stat={stat} active={statsSeen} />
          ))}
        </dl>

        <TestimonialCarousel />
      </Container>
    </section>
  )
}

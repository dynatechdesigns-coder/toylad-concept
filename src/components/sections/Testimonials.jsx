import { stats, statsAreReal } from '../../data/stats'
import useSectionInView from '../../hooks/useSectionInView'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import StatCounter from './StatCounter'
import TestimonialCarousel from './TestimonialCarousel'

const statsId = 'stats'

// `reviews` are the approved customer reviews from the database. The stats row only shows once the
// figures in data/stats.js are confirmed. With neither, the whole section is left out.
export default function Testimonials({ reviews }) {
  const statsSeen = useSectionInView(statsId, { once: true, threshold: 0.3 })
  if (reviews.length === 0 && !statsAreReal) return null

  return (
    <section id="testimonials" className="scroll-mt-24 overflow-hidden bg-navy py-20 text-cream md:py-28">
      <Container>
        <SectionHeading
          tone="dark"
          eyebrow="Reviews"
          title="Loved by hosts and their guests"
          subtitle={statsAreReal ? 'The numbers we are proud of, and the kind words behind them.' : 'Kind words from the people we have baked and styled for.'}
        />

        {statsAreReal && (
          <dl id={statsId} className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-16 md:gap-x-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatCounter key={stat.id} stat={stat} active={statsSeen} />
            ))}
          </dl>
        )}

        {reviews.length > 0 && <TestimonialCarousel testimonials={reviews} />}
      </Container>
    </section>
  )
}

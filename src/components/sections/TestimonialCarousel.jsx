import { useRef, useState } from 'react'
import { prefersReducedMotion } from '../../utils/format'
import TestimonialCard from './TestimonialCard'

// Swipeable scroll-snap row with dots below lg; a plain 3-column grid from lg up.
// `testimonials` are approved reviews: { id, name, rating, comment, occasion }.
export default function TestimonialCarousel({ testimonials }) {
  const trackRef = useRef(null)
  const [current, setCurrent] = useState(0)

  const onScroll = () => {
    const track = trackRef.current
    const centre = track.scrollLeft + track.clientWidth / 2
    const distances = Array.from(track.children, (card) =>
      Math.abs(card.offsetLeft - track.offsetLeft + card.offsetWidth / 2 - centre),
    )
    setCurrent(distances.indexOf(Math.min(...distances)))
  }

  const goTo = (index) => {
    trackRef.current.children[index].scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }

  return (
    <>
      <ul
        ref={trackRef}
        onScroll={onScroll}
        className="-mx-4 mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mt-16 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {testimonials.map((testimonial) => (
          <li key={testimonial.id} className="w-[85%] shrink-0 snap-center sm:w-[60%] lg:w-auto">
            <TestimonialCard testimonial={testimonial} />
          </li>
        ))}
      </ul>

      <div className={`mt-4 justify-center lg:hidden ${testimonials.length > 1 ? 'flex' : 'hidden'}`}>
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Show review ${index + 1} of ${testimonials.length}`}
            aria-current={index === current ? 'true' : undefined}
            className="group flex size-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-butter"
          >
            <span
              className={`h-2.5 rounded-full transition-all duration-300 ease-out motion-reduce:transition-none ${
                index === current ? 'w-6 bg-butter' : 'w-2.5 bg-cream/30 group-hover:bg-cream/60'
              }`}
            />
          </button>
        ))}
      </div>
    </>
  )
}

import { Star } from 'lucide-react'

const maxRating = 5

// "Adaeze & Tunde" → "AT", "Kemi A." → "KA"
function initialsOf(name) {
  return name
    .split(/[^\p{L}]+/u)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

export default function TestimonialCard({ testimonial }) {
  const { rating, quote, name, event } = testimonial

  return (
    <figure className="flex h-full flex-col rounded-3xl border border-cream/10 bg-cream/5 p-6 md:p-8">
      <div role="img" aria-label={`${rating} out of ${maxRating} stars`} className="flex gap-1">
        {Array.from({ length: maxRating }, (_, index) => (
          <Star
            key={index}
            className={`size-4 ${index < rating ? 'fill-butter text-butter' : 'text-cream/30'}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <blockquote className="mt-5 text-base leading-relaxed text-cream/90">“{quote}”</blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-6">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-butter font-display text-base font-bold text-espresso"
        >
          {initialsOf(name)}
        </span>
        <span>
          <span className="block font-semibold text-cream">{name}</span>
          <span className="block text-sm text-cream/75">{event}</span>
        </span>
      </figcaption>
    </figure>
  )
}

import { Check } from 'lucide-react'
import { formatPrice } from '../../utils/format'
import Button from '../ui/Button'

export default function PackageCard({ tier, groupLabel, onSelect }) {
  const frame = tier.featured ? 'border-2 border-terracotta shadow-xl lg:scale-105' : 'border border-espresso/10 shadow-sm'

  return (
    <article
      className={`relative flex h-full flex-col rounded-3xl bg-cream p-6 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-8 ${frame}`}
    >
      {tier.featured && (
        <p className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-butter px-4 py-1 text-xs font-semibold uppercase tracking-widest text-espresso">
          Most Popular
        </p>
      )}

      <h3 className="text-xl font-semibold md:text-2xl">{tier.name}</h3>
      <p className="mt-1 text-sm text-espresso/70">{tier.covers}</p>
      <p className="mt-6 text-sm text-espresso/70">
        from <span className="font-display text-4xl font-bold text-espresso">{formatPrice(tier.priceFrom)}</span>
      </p>

      <ul className="mb-8 mt-6 space-y-3">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-espresso/80">
            <Check className="mt-0.5 size-4 shrink-0 text-terracotta" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        href="#booking"
        variant={tier.featured ? 'sunny' : 'outline'}
        onClick={onSelect}
        className="mt-auto w-full"
      >
        Book {tier.name}
        <span className="sr-only"> ({groupLabel})</span>
      </Button>
    </article>
  )
}

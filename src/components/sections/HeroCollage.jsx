import { Cake, Flower2, Sparkles } from 'lucide-react'
import hero from '../../data/hero'
import { heroStat } from '../../data/stats'
import SmartImage from '../ui/SmartImage'

export default function HeroCollage() {
  const { main, accent } = hero.images

  return (
    <div className="relative mx-auto w-full max-w-md animate-fade-up pb-8 [animation-delay:450ms] lg:max-w-lg">
      <SmartImage
        src={main.src}
        alt={main.alt}
        aspect="4 / 5"
        rounded="rounded-3xl"
        icon={Cake}
        loading="eager"
        fetchPriority="high"
        className="ml-auto w-5/6 border border-espresso/5 shadow-xl"
      />
      <SmartImage
        src={accent.src}
        alt={accent.alt}
        aspect="1 / 1"
        icon={Flower2}
        className="absolute bottom-0 left-0 w-2/5 border-4 border-cream shadow-xl"
      />
      <div className="absolute left-0 top-6 flex items-center gap-3 rounded-2xl bg-cream px-4 py-3 shadow-xl sm:top-10">
        <span className="flex size-10 items-center justify-center rounded-full bg-butter text-espresso">
          <Sparkles className="size-5" aria-hidden="true" />
        </span>
        <p className="text-sm leading-tight text-espresso/75">
          <span className="block font-display text-xl font-bold text-espresso">{heroStat.value}</span>
          {heroStat.label}
        </p>
      </div>
    </div>
  )
}

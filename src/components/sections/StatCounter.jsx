import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../../utils/format'

const duration = 1600

// Counts from 0 to stat.value once `active` turns true. Shows the final value straight away under reduced motion.
export default function StatCounter({ stat, active }) {
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? stat.value : 0))

  useEffect(() => {
    if (!active || prefersReducedMotion()) return undefined

    let frame
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setDisplay(Math.round(stat.value * (1 - (1 - progress) ** 3)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [active, stat.value])

  return (
    <div className="flex flex-col-reverse gap-2 text-center">
      <dt className="text-sm text-cream/75 md:text-base">{stat.label}</dt>
      <dd className="font-display text-3xl font-bold text-butter sm:text-4xl md:text-5xl">
        <span aria-hidden="true">
          {display.toLocaleString('en-NG')}
          {stat.suffix}
        </span>
        <span className="sr-only">
          {stat.value.toLocaleString('en-NG')}
          {stat.suffix}
        </span>
      </dd>
    </div>
  )
}

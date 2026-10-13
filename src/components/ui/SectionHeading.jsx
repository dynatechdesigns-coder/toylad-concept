// `tone` matches the section background: "light" = cream, "soft" = butter-soft, "dark" = navy.
const eyebrowTones = { light: 'text-terracotta-deep', soft: 'text-navy', dark: 'text-cream/80' }
const subtitleTones = { light: 'text-espresso/75', soft: 'text-espresso/75', dark: 'text-cream/75' }

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', tone = 'light', className = '' }) {
  const alignment = align === 'left' ? 'text-left' : 'mx-auto text-center'

  return (
    <div className={`max-w-3xl ${alignment} ${className}`}>
      {eyebrow && (
        <p className={`mb-3 text-sm font-semibold uppercase tracking-widest ${eyebrowTones[tone]}`}>{eyebrow}</p>
      )}
      <h2 className="text-3xl font-semibold md:text-5xl">{title}</h2>
      {subtitle && <p className={`mt-4 text-base leading-relaxed md:text-lg ${subtitleTones[tone]}`}>{subtitle}</p>}
    </div>
  )
}

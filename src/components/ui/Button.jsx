const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary: 'bg-terracotta-deep text-white shadow-sm hover:bg-teal hover:shadow-xl',
  secondary: 'bg-teal text-white shadow-sm hover:bg-navy hover:shadow-xl',
  outline: 'border border-terracotta-deep text-terracotta-deep hover:bg-terracotta-deep hover:text-white',
  sunny: 'bg-butter text-espresso shadow-sm hover:bg-terracotta-deep hover:text-white hover:shadow-xl',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-base md:text-lg',
}

const iconSizes = { sm: 'size-4', md: 'size-5', lg: 'size-5' }

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  icon: Icon,
  className = '',
  children,
  ...props
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  const content = (
    <>
      {Icon && <Icon className={iconSizes[size]} aria-hidden="true" />}
      {children}
    </>
  )

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  )
}

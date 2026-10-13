import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

// Pass `aspect={null}` to control the ratio with classes instead (e.g. responsive ratios).
export default function SmartImage({
  src,
  alt,
  aspect = '4 / 3',
  rounded = 'rounded-2xl',
  icon: Icon = ImageIcon,
  loading = 'lazy',
  className = '',
  imgClassName = '',
  ...props
}) {
  const [failedSrc, setFailedSrc] = useState(null)
  const failed = !src || failedSrc === src

  return (
    <div
      className={`overflow-hidden ${rounded} ${className}`}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      {failed ? (
        <div
          role="img"
          aria-label={alt}
          className="flex size-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-butter-soft to-cream p-4 text-center"
        >
          <Icon className="size-8 text-terracotta" strokeWidth={1.25} aria-hidden="true" />
          <span className="font-display text-sm italic text-espresso/70">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onError={() => setFailedSrc(src)}
          className={`size-full object-cover ${imgClassName}`}
          {...props}
        />
      )}
    </div>
  )
}

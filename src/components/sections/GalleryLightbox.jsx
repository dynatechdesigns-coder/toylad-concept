import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import site from '../../data/site'
import Button from '../ui/Button'
import SmartImage from '../ui/SmartImage'

const iconButton =
  'inline-flex size-11 items-center justify-center rounded-full border border-espresso/15 bg-cream text-espresso transition duration-300 ease-out hover:border-teal hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal motion-reduce:transition-none'

// Native modal <dialog>: the browser traps focus and makes the page behind inert.
export default function GalleryLightbox({ item, category, position, total, onClose, onPrev, onNext, setBookingPreset }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const previousFocus = document.activeElement
    dialog.showModal()
    document.body.style.overflow = 'hidden'

    return () => {
      dialog.close()
      document.body.style.overflow = ''
      previousFocus?.focus({ preventScroll: true })
    }
  }, [])

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    } else if (event.key === 'ArrowLeft') onPrev()
    else if (event.key === 'ArrowRight') onNext()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="lightbox-title"
      onKeyDown={onKeyDown}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="m-auto max-h-dvh w-full max-w-4xl bg-transparent p-4 text-espresso backdrop:bg-espresso/80 backdrop:backdrop-blur-sm"
    >
      <div className="relative grid max-h-[calc(100dvh-2rem)] animate-pop-in overflow-y-auto rounded-3xl bg-cream shadow-xl md:grid-cols-2">
        <button type="button" onClick={onClose} aria-label="Close" className={`absolute right-3 top-3 z-10 ${iconButton}`}>
          <X className="size-5" aria-hidden="true" />
        </button>

        <SmartImage
          src={item.image}
          alt={item.title}
          aspect={null}
          rounded="rounded-none"
          loading="eager"
          srcSet={item.srcSet}
          sizes={item.srcSet && '(min-width: 768px) 448px, 100vw'}
          className="aspect-[4/3] md:aspect-[4/5]"
        />

        <div className="flex flex-col p-6 md:p-8" aria-live="polite">
          <span className="self-start rounded-full bg-butter px-3 py-1 text-xs font-semibold text-espresso">
            {category.label}
          </span>
          <h3 id="lightbox-title" className="mt-4 pr-10 text-xl font-semibold md:pr-0 md:text-2xl">
            {item.title}
          </h3>
          {item.description && <p className="mt-3 text-base leading-relaxed text-espresso/75">{item.description}</p>}
          <p className="mt-4 font-display text-lg font-semibold text-terracotta-deep">{site.priceNote}</p>

          <Button
            href="#booking"
            className="mt-6 md:mt-8"
            onClick={() => {
              setBookingPreset({ service: category.service, package: null })
              onClose()
            }}
          >
            Order this style
          </Button>

          {total > 1 && (
            <div className="mt-auto flex items-center justify-between pt-6">
              <button type="button" onClick={onPrev} aria-label="Previous item" className={iconButton}>
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <p className="text-sm text-espresso/70">
                {position} of {total}
              </p>
              <button type="button" onClick={onNext} aria-label="Next item" className={iconButton}>
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  )
}

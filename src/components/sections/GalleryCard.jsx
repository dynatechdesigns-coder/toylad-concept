import { Expand } from 'lucide-react'
import SmartImage from '../ui/SmartImage'

export default function GalleryCard({ item, categoryLabel, aspect, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View ${item.title}`}
      className="group relative mb-6 block w-full animate-pop-in break-inside-avoid overflow-hidden rounded-2xl text-left shadow-sm transition duration-300 ease-out hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-cream motion-reduce:transition-none md:mb-8"
    >
      <SmartImage
        src={item.image}
        alt={item.title}
        aspect={aspect}
        imgClassName="transition duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-espresso/90 via-espresso/30 to-transparent p-4 opacity-0 transition duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100">
        <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-cream/90 text-espresso">
          <Expand className="size-4" aria-hidden="true" />
        </span>
        <span className="self-start rounded-full bg-butter px-3 py-1 text-xs font-semibold text-espresso">
          {categoryLabel}
        </span>
        <span className="mt-2 font-display text-base font-semibold leading-snug text-cream md:text-lg">
          {item.title}
        </span>
      </span>
    </button>
  )
}

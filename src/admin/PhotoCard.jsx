import { Eye, EyeOff, Star } from 'lucide-react'
import SmartImage from '../components/ui/SmartImage'
import { cloudinaryUrl } from '../utils/cloudinary'
import PhotoActions from './PhotoActions'

const pill = 'rounded-full bg-butter px-3 py-1 text-sm font-semibold text-espresso'

export default function PhotoCard({ photo, categoryLabel, isFirst, isLast, busy, onFeature, onToggle, onEdit, onMove, onDelete }) {
  const VisibilityIcon = photo.published ? Eye : EyeOff

  return (
    <li className="overflow-hidden rounded-3xl border border-espresso/10 bg-cream shadow-sm transition duration-300 ease-out hover:shadow-xl motion-reduce:transition-none">
      <div className="relative">
        <SmartImage
          src={cloudinaryUrl(photo.imageUrl, 800)}
          alt={photo.title}
          rounded="rounded-none"
          imgClassName={photo.published ? '' : 'opacity-40'}
        />
        <div className="absolute inset-x-3 top-3 flex flex-wrap justify-between gap-2">
          <span className={pill}>{categoryLabel}</span>
          {photo.featured && (
            <span className={`${pill} inline-flex items-center gap-1`}>
              <Star className="size-4 fill-terracotta-deep text-terracotta-deep" aria-hidden="true" />
              On “All”
            </span>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6">
        <h3 className="break-words text-xl font-semibold">{photo.title}</h3>

        <button
          type="button"
          aria-describedby={`photo-${photo.id}-visibility`}
          disabled={busy}
          onClick={onToggle}
          className={`mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-4 text-base font-semibold transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-60 motion-reduce:transition-none ${
            photo.published ? 'bg-teal text-white hover:bg-navy' : 'border border-espresso/30 text-espresso hover:border-teal'
          }`}
        >
          <VisibilityIcon className="size-5" aria-hidden="true" />
          {photo.published ? 'Visible' : 'Hidden'}
          <span className="sr-only">: {photo.title}</span>
        </button>
        <p id={`photo-${photo.id}-visibility`} className="mb-4 mt-2 text-center text-sm text-espresso/70">
          {photo.published ? 'Customers can see this photo. Tap to hide it.' : 'Customers cannot see this photo. Tap to show it.'}
        </p>

        <PhotoActions
          photo={photo}
          busy={busy}
          isFirst={isFirst}
          isLast={isLast}
          onFeature={onFeature}
          onEdit={onEdit}
          onMove={onMove}
          onDelete={onDelete}
        />
      </div>
    </li>
  )
}

import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'
import SmartImage from '../components/ui/SmartImage'
import { cloudinaryUrl } from '../utils/cloudinary'
import { actionButton } from './fieldStyles'

export default function PhotoCard({ photo, categoryLabel, isFirst, isLast, busy, onToggle, onEdit, onMove, onDelete }) {
  const VisibilityIcon = photo.published ? Eye : EyeOff

  return (
    <li className="overflow-hidden rounded-3xl border border-espresso/10 bg-cream shadow-sm">
      <div className="relative">
        <SmartImage
          src={cloudinaryUrl(photo.imageUrl, 800)}
          alt={photo.title}
          rounded="rounded-none"
          imgClassName={photo.published ? '' : 'opacity-40'}
        />
        <span className="absolute left-3 top-3 rounded-full bg-butter px-3 py-1 text-sm font-semibold text-espresso">
          {categoryLabel}
        </span>
      </div>

      <div className="p-4">
        <h3 className="break-words font-sans text-lg font-semibold">{photo.title}</h3>

        <button
          type="button"
          aria-describedby={`photo-${photo.id}-visibility`}
          disabled={busy}
          onClick={onToggle}
          className={`mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-4 text-base font-semibold transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-60 motion-reduce:transition-none ${
            photo.published ? 'bg-teal text-white' : 'border border-espresso/30 text-espresso'
          }`}
        >
          <VisibilityIcon className="size-5" aria-hidden="true" />
          {photo.published ? 'Visible' : 'Hidden'}
          <span className="sr-only">: {photo.title}</span>
        </button>
        <p id={`photo-${photo.id}-visibility`} className="mt-2 text-center text-sm text-espresso/70">
          {photo.published ? 'Customers can see this photo. Tap to hide it.' : 'Customers cannot see this photo. Tap to show it.'}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" disabled={busy || isFirst} onClick={() => onMove(-1)} className={actionButton}>
            <ArrowUp className="size-5" aria-hidden="true" />
            Move up
          </button>
          <button type="button" disabled={busy || isLast} onClick={() => onMove(1)} className={actionButton}>
            <ArrowDown className="size-5" aria-hidden="true" />
            Move down
          </button>
          <button type="button" disabled={busy} onClick={onEdit} className={actionButton}>
            <Pencil className="size-5" aria-hidden="true" />
            Edit
          </button>
          <button type="button" disabled={busy} onClick={onDelete} className={actionButton}>
            <Trash2 className="size-5 text-terracotta-deep" aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>
    </li>
  )
}

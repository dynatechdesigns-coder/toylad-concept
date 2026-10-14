import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Star, Trash2 } from 'lucide-react'
import { actionButton } from './fieldStyles'

const compactButton =
  'inline-flex aspect-square w-full max-w-10 items-center justify-center rounded-full border border-espresso/20 bg-cream text-espresso shadow-sm transition duration-300 ease-out hover:border-teal hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none'

// The owner's buttons for one photo. Pass only the handlers you want: a missing handler hides its button.
// `compact` shows small icon buttons (public gallery); otherwise large labelled ones (admin).
export default function PhotoActions({ photo, busy, compact = false, isFirst, isLast, onFeature, onToggle, onEdit, onMove, onDelete }) {
  const actions = [
    onFeature && {
      id: 'feature',
      label: photo.featured ? 'Featured on All' : 'Feature on All',
      icon: Star,
      iconClass: photo.featured ? 'fill-butter text-terracotta-deep' : '',
      pressed: photo.featured,
      wide: true,
      onClick: onFeature,
    },
    onToggle && {
      id: 'visibility',
      label: photo.published ? 'Hide' : 'Show',
      icon: photo.published ? EyeOff : Eye,
      onClick: onToggle,
    },
    onMove && { id: 'up', label: 'Move up', icon: ArrowUp, disabled: isFirst, onClick: () => onMove(-1) },
    onMove && { id: 'down', label: 'Move down', icon: ArrowDown, disabled: isLast, onClick: () => onMove(1) },
    onEdit && { id: 'edit', label: 'Edit', icon: Pencil, onClick: onEdit },
    onDelete && { id: 'delete', label: 'Delete', icon: Trash2, iconClass: 'text-terracotta-deep', onClick: onDelete },
  ].filter(Boolean)

  return (
    <div className={compact ? 'mx-auto mt-2 grid max-w-44 grid-cols-4 justify-items-center gap-1' : 'grid grid-cols-2 gap-2'}>
      {actions.map(({ id, label, icon: Icon, iconClass = '', pressed, wide, disabled, onClick }) => (
        <button
          key={id}
          type="button"
          aria-pressed={pressed}
          aria-label={compact ? `${label}: ${photo.title}` : undefined}
          title={compact ? label : undefined}
          disabled={busy || disabled}
          onClick={onClick}
          className={compact ? compactButton : `${actionButton} gap-1.5 whitespace-nowrap px-2 ${wide ? 'col-span-2' : ''}`}
        >
          <Icon className={`size-5 shrink-0 ${iconClass}`} aria-hidden="true" />
          {!compact && label}
        </button>
      ))}
    </div>
  )
}

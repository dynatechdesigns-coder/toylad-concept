import { X } from 'lucide-react'
import PhotoFields from './PhotoFields'

// One picked photo waiting to be published: preview, title, category and upload progress.
export default function UploadDraft({ draft, number, disabled, onChange, onRemove }) {
  const uploading = draft.progress !== null

  return (
    <li className="rounded-3xl border border-espresso/10 bg-cream p-4 shadow-sm">
      <div className="relative overflow-hidden rounded-2xl">
        <img src={draft.previewUrl} alt={`Preview of photo ${number}`} className="aspect-[4/3] w-full object-cover" />
        {!disabled && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove photo ${number}`}
            className="absolute right-2 top-2 flex size-12 items-center justify-center rounded-full bg-cream text-espresso shadow-sm transition duration-300 ease-out hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal motion-reduce:transition-none"
          >
            <X className="size-6" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mt-4">
        <PhotoFields
          idPrefix={`draft-${draft.id}`}
          title={draft.title}
          category={draft.category}
          errors={draft.errors}
          disabled={disabled}
          onChange={onChange}
        />
      </div>

      {uploading && (
        <div className="mt-4">
          <div
            role="progressbar"
            aria-label={`Uploading photo ${number}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={draft.progress}
            className="h-3 overflow-hidden rounded-full bg-espresso/10"
          >
            <div
              className="h-full rounded-full bg-teal transition-[width] duration-300 ease-out motion-reduce:transition-none"
              style={{ width: `${draft.progress}%` }}
            />
          </div>
          <p className="mt-2 text-base font-medium text-espresso/80">
            {draft.progress < 100 ? `Uploading… ${draft.progress}%` : 'Almost done…'}
          </p>
        </div>
      )}

      {draft.failure && (
        <p role="alert" className="mt-4 rounded-2xl border border-terracotta-deep bg-butter-soft p-3 text-base font-medium text-espresso">
          {draft.failure}
        </p>
      )}
    </li>
  )
}

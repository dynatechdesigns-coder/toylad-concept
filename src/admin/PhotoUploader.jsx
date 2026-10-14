import { Camera, CircleCheck, ImagePlus, Send } from 'lucide-react'
import Button from '../components/ui/Button'
import UploadDraft from './UploadDraft'
import usePhotoDrafts from './usePhotoDrafts'

const pickerBase =
  'flex min-h-16 cursor-pointer items-center justify-center gap-3 rounded-full px-6 text-lg font-semibold transition duration-300 ease-out focus-within:ring-2 focus-within:ring-teal focus-within:ring-offset-2 focus-within:ring-offset-cream motion-reduce:transition-none'

// The file input sits inside its label, so tapping the label opens the phone's picker.
function onPick(addFiles) {
  return (event) => {
    addFiles(event.target.files)
    event.target.value = ''
  }
}

// `stacked` keeps everything in one column, for narrow places such as a dialog.
export default function PhotoUploader({ onUploaded, onSessionExpired, onProblem, stacked = false }) {
  const { drafts, publishing, message, addFiles, remove, change, publish } = usePhotoDrafts({
    onUploaded,
    onSessionExpired,
    onProblem,
  })
  const count = drafts.length
  const idle = publishing ? 'pointer-events-none opacity-50' : ''

  return (
    <section aria-labelledby="add-photo-title">
      <h2 id="add-photo-title" className="sr-only">
        Add photos
      </h2>

      <div className={`grid gap-3 ${stacked ? '' : 'sm:grid-cols-2'}`}>
        <label className={`${pickerBase} ${idle} bg-terracotta-deep text-white shadow-sm hover:bg-teal hover:shadow-xl`}>
          <ImagePlus className="size-6" aria-hidden="true" />
          Add photo
          <input type="file" accept="image/*" multiple disabled={publishing} onChange={onPick(addFiles)} className="sr-only" />
        </label>
        <label
          className={`${pickerBase} ${idle} border border-terracotta-deep text-terracotta-deep hover:bg-terracotta-deep hover:text-white`}
        >
          <Camera className="size-6" aria-hidden="true" />
          Take a photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            disabled={publishing}
            onChange={onPick(addFiles)}
            className="sr-only"
          />
        </label>
      </div>
      <p className="mt-3 text-center text-base text-espresso/75">You can choose several photos at once.</p>

      <div aria-live="polite">
        {message.length > 0 && (
          <div className="mt-6 flex items-start gap-3 rounded-3xl bg-teal p-4 text-lg font-semibold text-white">
            <CircleCheck className="mt-0.5 size-6 shrink-0" aria-hidden="true" />
            <div className="space-y-2">
              {message.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {count > 0 && (
        <form
          noValidate
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault()
            publish()
          }}
        >
          <ul className={`grid gap-6 ${stacked ? '' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {drafts.map((draft, index) => (
              <UploadDraft
                key={draft.id}
                draft={draft}
                number={index + 1}
                disabled={publishing}
                onChange={(name, value) => change(draft.id, name, value)}
                onRemove={() => remove(draft.id)}
              />
            ))}
          </ul>
          <Button type="submit" size="lg" icon={Send} disabled={publishing} className="mt-6 min-h-16 w-full">
            {publishing ? 'Publishing…' : count === 1 ? 'Publish' : `Publish ${count} photos`}
          </Button>
        </form>
      )}
    </section>
  )
}

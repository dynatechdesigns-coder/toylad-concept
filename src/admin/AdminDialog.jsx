import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

// Native modal <dialog>: the browser traps focus, and Esc or a tap outside closes it.
export default function AdminDialog({ title, onClose, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    return () => dialog.close()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="admin-dialog-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="m-auto max-h-dvh w-full max-w-md bg-transparent p-4 text-espresso backdrop:bg-espresso/80 backdrop:backdrop-blur-sm"
    >
      <div className="relative max-h-[calc(100dvh-2rem)] animate-pop-in overflow-y-auto rounded-3xl bg-cream p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-full border border-espresso/15 bg-cream text-espresso transition duration-300 ease-out hover:border-teal hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal motion-reduce:transition-none"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
        <h2 id="admin-dialog-title" className="pr-12 text-xl font-semibold md:text-2xl">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  )
}

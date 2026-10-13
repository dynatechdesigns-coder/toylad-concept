import { useEffect, useRef } from 'react'

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
      className="m-auto w-full max-w-md bg-transparent p-4 text-espresso backdrop:bg-espresso/80"
    >
      <div className="animate-pop-in rounded-3xl bg-cream p-6 shadow-xl">
        <h2 id="admin-dialog-title" className="text-xl font-semibold md:text-2xl">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  )
}

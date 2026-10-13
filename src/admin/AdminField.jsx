import { CircleAlert } from 'lucide-react'

// Label and error message around one control. The control must use the same `id`.
export default function AdminField({ id, label, error, children }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-base font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 flex items-start gap-1.5 text-base font-medium text-espresso">
          <CircleAlert className="mt-1 size-4 shrink-0 text-terracotta-deep" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

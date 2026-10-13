import { CircleAlert } from 'lucide-react'

// Renders one labelled control from a field definition in data/booking.js.
export default function FormField({ field, value, error, options = [], min, onChange, onBlur }) {
  const id = `booking-${field.name}`
  const errorId = `${id}-error`
  const shared = {
    id,
    name: field.name,
    value,
    onChange,
    onBlur,
    required: Boolean(field.required),
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: `block min-h-12 w-full rounded-2xl border bg-cream px-4 py-3 text-base text-espresso transition duration-300 ease-out placeholder:text-espresso/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal motion-reduce:transition-none ${
      error ? 'border-terracotta-deep' : 'border-espresso/20'
    }`,
  }

  let control
  if (field.type === 'select') {
    control = (
      <select {...shared}>
        <option value="">{field.placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  } else if (field.type === 'textarea') {
    control = <textarea {...shared} rows={4} placeholder={field.placeholder} />
  } else {
    control = (
      <input
        {...shared}
        type={field.type}
        min={min ?? field.min}
        maxLength={field.maxLength}
        inputMode={field.inputMode}
        autoComplete={field.autoComplete}
        placeholder={field.placeholder}
      />
    )
  }

  return (
    <div className={`min-w-0 ${field.full ? 'sm:col-span-2' : ''}`}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {field.label}
        {field.required && (
          <span className="text-navy" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {control}
      {error && (
        <p id={errorId} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-espresso">
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-terracotta-deep" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

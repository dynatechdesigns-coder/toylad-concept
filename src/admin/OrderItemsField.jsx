import { Plus, X } from 'lucide-react'
import { orderCategories } from '../data/orders'
import { actionButton, controlClass } from './fieldStyles'
import { blankItem } from './orderDefaults'

// The list of things in an order. `items` holds text values; the dialog turns quantities into numbers on save.
export default function OrderItemsField({ items, error, disabled, onChange }) {
  const update = (index, name, value) => onChange(items.map((item, at) => (at === index ? { ...item, [name]: value } : item)))

  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="mb-2 block text-base font-semibold">What did they order?</legend>
      <ul className="grid gap-3">
        {items.map((item, index) => (
          // Rows have no id of their own; the position is stable while the dialog is open.
          // eslint-disable-next-line react/no-array-index-key
          <li key={index} className="rounded-2xl border border-espresso/15 bg-butter-soft p-3">
            <div className="flex items-start gap-2">
              <input
                type="text"
                aria-label={`Item ${index + 1}: what is it?`}
                placeholder="e.g. Two-tier vanilla cake"
                maxLength={100}
                value={item.name}
                onChange={(event) => update(index, 'name', event.target.value)}
                className={controlClass()}
              />
              {items.length > 1 && (
                <button
                  type="button"
                  aria-label={`Remove item ${index + 1}`}
                  onClick={() => onChange(items.filter((_, at) => at !== index))}
                  className="inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-espresso/20 bg-cream text-espresso transition duration-300 ease-out hover:border-teal hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal motion-reduce:transition-none"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              )}
            </div>
            <div className="mt-2 grid grid-cols-[3fr_2fr] gap-2">
              <select
                aria-label={`Item ${index + 1}: type`}
                value={item.category}
                onChange={(event) => update(index, 'category', event.target.value)}
                className={controlClass()}
              >
                <option value="">Type</option>
                {orderCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                inputMode="numeric"
                aria-label={`Item ${index + 1}: how many?`}
                placeholder="How many"
                value={item.quantity}
                onChange={(event) => update(index, 'quantity', event.target.value)}
                className={controlClass()}
              />
            </div>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => onChange([...items, blankItem])} className={`${actionButton} mt-3 w-full`}>
        <Plus className="size-5" aria-hidden="true" />
        Add another item
      </button>
      {error && (
        <p role="alert" className="mt-2 text-base font-medium text-espresso">
          {error}
        </p>
      )}
    </fieldset>
  )
}

import { Star } from 'lucide-react'

// Five stars to tap. `value` is 0 (nothing chosen) to 5. Each star is a real radio button, so it works with a keyboard.
// `words` names each star for screen readers and shows the chosen one, e.g. "Excellent".
export default function StarRating({ name, label, value, words, error, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-semibold">
        {label}
        <span className="text-navy" aria-hidden="true">
          {' '}
          *
        </span>
      </legend>
      <div className="flex items-center gap-1">
        {words.map((word, index) => {
          const stars = index + 1
          return (
            <label key={word} className="cursor-pointer rounded-full has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal">
              <input type="radio" name={name} value={stars} checked={value === stars} required onChange={() => onChange(stars)} className="sr-only" />
              <Star
                className={`size-12 p-1 transition duration-300 ease-out motion-reduce:transition-none ${stars <= value ? 'fill-butter text-terracotta-deep' : 'text-espresso/30'}`}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="sr-only">
                {stars} {stars === 1 ? 'star' : 'stars'}: {word}
              </span>
            </label>
          )
        })}
      </div>
      <p className="mt-2 min-h-6 text-base font-medium text-espresso" aria-live="polite">
        {error || (value > 0 ? words[value - 1] : '')}
      </p>
    </fieldset>
  )
}

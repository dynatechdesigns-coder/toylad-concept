import months from '../../data/months'

const emptyDayMonth = { day: '', month: '' }

// A date without a year (birthday, anniversary): `value` is { day, month } as strings, '' when not chosen.
// `selectClassName` styles both selects so the field matches the form it sits in.
export default function DayMonthField({ id, label, value = emptyDayMonth, disabled, selectClassName, onChange }) {
  const maxDays = months.find((month) => String(month.number) === value.month)?.days ?? 31

  const onMonth = (month) => {
    const days = months.find((item) => String(item.number) === month)?.days ?? 31
    // Changing the month can make the chosen day impossible (e.g. 31 then April): clear it.
    onChange({ month, day: Number(value.day) > days ? '' : value.day })
  }

  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 block text-sm font-semibold">{label}</legend>
      <div className="grid grid-cols-[2fr_3fr] gap-3">
        <select
          id={`${id}-day`}
          aria-label={`${label}: day`}
          value={value.day}
          disabled={disabled}
          onChange={(event) => onChange({ ...value, day: event.target.value })}
          className={selectClassName}
        >
          <option value="">Day</option>
          {Array.from({ length: maxDays }, (_, index) => index + 1).map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <select
          id={`${id}-month`}
          aria-label={`${label}: month`}
          value={value.month}
          disabled={disabled}
          onChange={(event) => onMonth(event.target.value)}
          className={selectClassName}
        >
          <option value="">Month</option>
          {months.map((month) => (
            <option key={month.number} value={month.number}>
              {month.name}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  )
}

// A simple horizontal bar chart that reads well on a phone: one row per thing, longest bar = biggest value.
// Every value is written at the end of its bar, so nothing depends on colour or on hovering.
// `rows` is [{ key, label, value, note? }]; `unit` names one of what is counted ("order"), `plural` several.
export default function BarList({ rows, unit, plural = `${unit}s`, emptyText }) {
  if (rows.length === 0) return <p className="mt-3 text-base text-espresso/75">{emptyText}</p>
  const max = Math.max(...rows.map((row) => row.value), 1)
  const counted = (value) => (value === 1 ? unit : plural)

  return (
    <ul className="mt-4 space-y-3">
      {rows.map((row) => (
        <li key={row.key} title={`${row.label}: ${row.value} ${counted(row.value)}`}>
          <p className="flex flex-wrap items-baseline gap-x-2 text-base">
            <span className="break-words font-medium">{row.label}</span>
            {row.note && <span className="text-sm text-espresso/70">{row.note}</span>}
          </p>
          <div className="mt-1 flex items-center gap-2">
            {/* Bars start square at the left edge and round off at the data end. */}
            {row.value > 0 && <span aria-hidden="true" className="h-4 min-w-1 rounded-r bg-teal" style={{ width: `calc((100% - 3.5rem) * ${row.value / max})` }} />}
            <span className={`text-base font-semibold ${row.value > 0 ? 'text-espresso' : 'text-espresso/60'}`}>
              {row.value}
              <span className="sr-only"> {counted(row.value)}</span>
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

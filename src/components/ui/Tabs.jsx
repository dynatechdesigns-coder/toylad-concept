const styles = {
  pills: {
    list: 'flex gap-3 overflow-x-auto p-1 [scrollbar-width:none] md:flex-wrap md:justify-center',
    tab: 'border px-5',
    active: 'border-terracotta-deep bg-terracotta-deep text-white',
    inactive: 'border-espresso/20 text-espresso hover:border-teal hover:text-navy',
  },
  segmented: {
    list: 'inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-espresso/10 bg-cream p-1 [scrollbar-width:none]',
    tab: 'px-5',
    active: 'bg-terracotta-deep text-white shadow-sm',
    inactive: 'text-espresso/70 hover:text-espresso',
  },
}

// Tab buttons for a single panel with id `${idPrefix}-panel`. Each tab: { id, label, count? }.
export default function Tabs({ tabs, value, onChange, idPrefix, label, variant = 'pills', className = '' }) {
  const style = styles[variant]

  const onKeyDown = (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const index = tabs.findIndex((tab) => tab.id === value)
    const next = tabs[(index + step + tabs.length) % tabs.length]
    onChange(next.id)
    document.getElementById(`${idPrefix}-tab-${next.id}`)?.focus()
  }

  return (
    <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className={`${style.list} ${className}`}>
      {tabs.map((tab) => {
        const selected = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full text-sm font-semibold transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal motion-reduce:transition-none ${style.tab} ${
              selected ? style.active : style.inactive
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="rounded-full bg-espresso/10 px-2 py-0.5 text-xs">{tab.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

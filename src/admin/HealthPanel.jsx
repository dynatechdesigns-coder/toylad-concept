import { useEffect, useState } from 'react'
import { CircleCheck, CircleX, RefreshCw } from 'lucide-react'
import { getHealth } from './api'
import { actionButton } from './fieldStyles'

// Shown after an error: asks the server what is and is not connected, with a hint for each problem.
export default function HealthPanel() {
  // { status: 'loading' } | { status: 'done', data } | { status: 'failed', message }
  const [state, setState] = useState({ status: 'loading' })

  const check = () => {
    setState({ status: 'loading' })
    getHealth()
      .then((data) => setState({ status: 'done', data }))
      .catch((problem) => setState({ status: 'failed', message: problem.message }))
  }

  useEffect(() => {
    let active = true
    getHealth()
      .then((data) => active && setState({ status: 'done', data }))
      .catch((problem) => active && setState({ status: 'failed', message: problem.message }))
    return () => {
      active = false
    }
  }, [])

  return (
    <section aria-labelledby="health-title" aria-live="polite" className="mt-6 rounded-3xl border border-espresso/15 bg-butter-soft p-4 md:p-6">
      <h2 id="health-title" className="font-sans text-lg font-semibold">
        Connection check
      </h2>
      <p className="mt-1 text-base text-espresso/75">If the problem stays, send a screenshot of this box to your web developer.</p>

      {state.status === 'loading' && <p className="mt-4 text-base font-medium">Checking what went wrong…</p>}
      {state.status === 'failed' && <p className="mt-4 text-base font-medium">The check itself could not run. {state.message}</p>}

      {state.status === 'done' && (
        <>
          <ul className="mt-4 space-y-4">
            {state.data.checks.map((item) => {
              const Icon = item.ok ? CircleCheck : CircleX
              return (
                <li key={item.id} className="flex items-start gap-3">
                  <Icon className={`mt-0.5 size-6 shrink-0 ${item.ok ? 'text-teal' : 'text-terracotta-deep'}`} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-base font-semibold">
                      {item.label}: {item.ok ? 'working' : 'problem found'}
                    </p>
                    {item.hints.map((hint) => (
                      <p key={hint} className="mt-1 break-words text-base text-espresso">
                        {hint}
                      </p>
                    ))}
                    {item.detail && <p className="mt-1 text-sm text-espresso/70">Technical detail: {item.detail}</p>}
                    {!item.ok && item.items && (
                      <ul className="mt-2 space-y-1 text-sm text-espresso/80">
                        {item.items.map((entry) => (
                          <li key={entry.name} className="break-all">
                            {entry.name}: {entry.present ? 'set' : 'missing'}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
          {state.data.ok && (
            <p className="mt-4 text-base font-medium">Everything is connected. Please try again.</p>
          )}
        </>
      )}

      <button type="button" onClick={check} disabled={state.status === 'loading'} className={`${actionButton} mt-4 bg-cream`}>
        <RefreshCw className="size-5" aria-hidden="true" />
        Check again
      </button>
    </section>
  )
}

// One titled block on the Reports screen.
export default function ReportCard({ id, title, hint, children }) {
  return (
    <section aria-labelledby={id} className="rounded-3xl border border-espresso/10 bg-cream p-4 shadow-sm md:p-6">
      <h3 id={id} className="text-xl font-semibold md:text-2xl">
        {title}
      </h3>
      {hint && <p className="mt-1 text-base text-espresso/75">{hint}</p>}
      {children}
    </section>
  )
}

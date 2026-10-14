import { useState } from 'react'
import privacyNotice, { privacyLine } from '../../data/privacy'
import Modal from '../ui/Modal'

// A short privacy line under a form (the booking form's by default), with the full notice in a dialog.
export default function PrivacyNotice({ line = privacyLine }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <p className="mt-4 text-center text-sm leading-relaxed text-espresso/75">
        {line.text}{' '}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-11 items-center rounded-full font-semibold text-navy underline underline-offset-4 hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          {line.linkText}
        </button>
        .
      </p>

      {open && (
        <Modal title={privacyNotice.title} onClose={() => setOpen(false)}>
          <p className="mt-4 text-base leading-relaxed text-espresso/80">{privacyNotice.intro}</p>
          {privacyNotice.sections.map((section) => (
            <section key={section.heading} className="mt-6">
              <h3 className="font-sans text-base font-semibold">{section.heading}</h3>
              <p className="mt-1 text-base leading-relaxed text-espresso/80">{section.text}</p>
            </section>
          ))}
        </Modal>
      )}
    </>
  )
}

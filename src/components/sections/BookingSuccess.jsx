import { useEffect, useRef } from 'react'
import { CircleCheck, RotateCcw } from 'lucide-react'
import Button from '../ui/Button'
import WhatsAppLink from '../ui/WhatsAppLink'

export default function BookingSuccess({ whatsappHref, mailtoHref, onReset }) {
  const headingRef = useRef(null)

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div role="status" className="flex animate-pop-in flex-col items-center py-8 text-center">
      <CircleCheck className="size-14 text-teal" strokeWidth={1.25} aria-hidden="true" />
      <h3 ref={headingRef} tabIndex={-1} className="mt-6 text-xl font-semibold focus:outline-none md:text-2xl">
        Your request is ready to send
      </h3>
      <p className="mt-3 max-w-md text-base leading-relaxed text-espresso/75">
        We opened WhatsApp in a new tab with your details filled in. Press send there and we will reply with a quote.
      </p>

      <WhatsAppLink href={whatsappHref} className="mt-8 w-full sm:w-auto">
        WhatsApp did not open? Try again
      </WhatsAppLink>
      <Button variant="secondary" icon={RotateCcw} onClick={onReset} className="mt-4 w-full sm:w-auto">
        Start a new request
      </Button>
      {mailtoHref && (
        <p className="mt-6 text-sm text-espresso/70">
          Prefer email?{' '}
          <a
            href={mailtoHref}
            className="inline-flex min-h-11 items-center rounded-full font-semibold text-navy underline underline-offset-4 hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            Send this request by email
          </a>
        </p>
      )}
    </div>
  )
}

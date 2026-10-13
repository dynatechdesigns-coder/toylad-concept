import { MessageCircle } from 'lucide-react'
import { bookingIntro } from '../../data/booking'
import useSectionInView from '../../hooks/useSectionInView'
import { whatsappUrl } from '../../utils/format'

// Steps aside while the booking section is on screen so it never sits over the form or its submit button.
export default function FloatingWhatsApp() {
  const bookingVisible = useSectionInView('booking')

  return (
    <a
      href={whatsappUrl(bookingIntro.whatsappGreeting)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
      className={`fixed bottom-4 right-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-espresso shadow-xl transition-[opacity,scale,visibility] duration-300 ease-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-cream motion-reduce:transition-none motion-reduce:hover:scale-100 sm:bottom-6 sm:right-6 ${
        bookingVisible ? 'invisible opacity-0' : 'visible opacity-100'
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30 [animation-duration:2.5s] motion-reduce:hidden"
      />
      <MessageCircle className="relative size-7" aria-hidden="true" />
    </a>
  )
}

import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '../../utils/format'

// Opens WhatsApp in a new tab, either with a pre-filled `message` or a ready-made `href`.
export default function WhatsAppLink({ message = '', href, className = '', children, ...props }) {
  return (
    <a
      href={href ?? whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-espresso shadow-sm transition duration-300 ease-out hover:shadow-xl hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-cream motion-reduce:transition-none ${className}`}
    >
      <MessageCircle className="size-5" aria-hidden="true" />
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

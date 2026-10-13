import { Clock } from 'lucide-react'
import { bookingIntro, bookingSteps } from '../../data/booking'
import LocationList from '../ui/LocationList'
import SectionHeading from '../ui/SectionHeading'
import WhatsAppLink from '../ui/WhatsAppLink'

export default function BookingInfo() {
  return (
    <div>
      <SectionHeading align="left" eyebrow={bookingIntro.eyebrow} title={bookingIntro.title} subtitle={bookingIntro.text} />

      <ol className="mt-10 space-y-6">
        {bookingSteps.map(({ title, text, icon: Icon }, index) => (
          <li key={title} className="flex gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-terracotta/10 text-terracotta-deep">
              <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-lg font-semibold">
                <span className="text-terracotta-deep">{index + 1}.</span> {title}
              </h3>
              <p className="mt-1 text-base text-espresso/75">{text}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-10 flex items-center gap-2 text-sm font-medium text-espresso/80">
        <Clock className="size-4 shrink-0 text-teal" aria-hidden="true" />
        {bookingIntro.responseTime}
      </p>

      <WhatsAppLink message={bookingIntro.whatsappGreeting} className="mt-6 w-full sm:w-auto">
        Chat on WhatsApp
      </WhatsAppLink>

      <h3 className="mt-10 text-lg font-semibold">Visit us</h3>
      <LocationList className="mt-4" />
    </div>
  )
}

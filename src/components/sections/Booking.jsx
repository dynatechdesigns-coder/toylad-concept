import Container from '../ui/Container'
import BookingForm from './BookingForm'
import BookingInfo from './BookingInfo'

export default function Booking({ bookingPreset }) {
  return (
    <section id="booking" className="scroll-mt-24 bg-cream py-20 md:py-28">
      <Container className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <BookingInfo />
        <div className="min-w-0 rounded-3xl border border-espresso/10 bg-butter-soft p-6 shadow-sm md:p-10">
          <BookingForm bookingPreset={bookingPreset} />
        </div>
      </Container>
    </section>
  )
}

import { useState } from 'react'
import FloatingWhatsApp from './components/layout/FloatingWhatsApp'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import Booking from './components/sections/Booking'
import Gallery from './components/sections/Gallery'
import Hero from './components/sections/Hero'
import Packages from './components/sections/Packages'
import Services from './components/sections/Services'
import Testimonials from './components/sections/Testimonials'

export default function App() {
  // Set by any "Order"/"Book" CTA; the booking form pre-selects from it.
  const [bookingPreset, setBookingPreset] = useState({ service: null, package: null })

  return (
    <>
      <Navbar />
      <main>
        <Hero setBookingPreset={setBookingPreset} />
        <Services setBookingPreset={setBookingPreset} />
        <Gallery setBookingPreset={setBookingPreset} />
        <Packages setBookingPreset={setBookingPreset} />
        <Testimonials />
        <Booking bookingPreset={bookingPreset} />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}

import { Suspense, lazy, useState } from 'react'
import FloatingWhatsApp from './components/layout/FloatingWhatsApp'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import Academy from './components/sections/Academy'
import Booking from './components/sections/Booking'
import Gallery from './components/sections/Gallery'
import Hero from './components/sections/Hero'
import Packages from './components/sections/Packages'
import Services from './components/sections/Services'
import Testimonials from './components/sections/Testimonials'
import useOwnerSession from './hooks/useOwnerSession'

// Owner-only bar. Loaded only after the server confirms the owner is logged in.
const OwnerBar = lazy(() => import('./admin/OwnerBar'))

export default function App() {
  // Set by any "Order"/"Book" CTA; the booking form pre-selects from it.
  const [bookingPreset, setBookingPreset] = useState({ service: null, package: null })
  const [isOwner, setIsOwner] = useOwnerSession()
  const leaveOwnerMode = () => setIsOwner(false)

  return (
    <>
      <Navbar />
      <main>
        <Hero setBookingPreset={setBookingPreset} />
        <Services setBookingPreset={setBookingPreset} />
        <Gallery setBookingPreset={setBookingPreset} isOwner={isOwner} onOwnerSignedOut={leaveOwnerMode} />
        <Packages setBookingPreset={setBookingPreset} />
        <Testimonials />
        <Booking bookingPreset={bookingPreset} />
        <Academy />
      </main>
      <Footer />
      <FloatingWhatsApp />
      {isOwner && (
        <Suspense fallback={null}>
          <OwnerBar onSignedOut={leaveOwnerMode} />
        </Suspense>
      )}
    </>
  )
}

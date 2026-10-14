import { Suspense, lazy, useMemo, useState } from 'react'
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
import { navLinks } from './data/navigation'
import { statsAreReal } from './data/stats'
import useOwnerSession from './hooks/useOwnerSession'
import useReviews from './hooks/useReviews'

// Owner-only bar. Loaded only after the server confirms the owner is logged in.
const OwnerBar = lazy(() => import('./admin/OwnerBar'))

export default function App() {
  // Set by any "Order"/"Book" CTA; the booking form pre-selects from it.
  const [bookingPreset, setBookingPreset] = useState({ service: null, package: null })
  const [isOwner, setIsOwner] = useOwnerSession()
  const leaveOwnerMode = () => setIsOwner(false)
  const reviews = useReviews()
  // The Reviews section hides itself until there is something real to show, and its menu link goes with it.
  const showReviews = reviews.length > 0 || statsAreReal
  const links = useMemo(() => (showReviews ? navLinks : navLinks.filter((link) => link.id !== 'testimonials')), [showReviews])

  return (
    <>
      <Navbar links={links} isOwner={isOwner} />
      <main>
        <Hero setBookingPreset={setBookingPreset} />
        <Services setBookingPreset={setBookingPreset} />
        <Gallery setBookingPreset={setBookingPreset} isOwner={isOwner} onOwnerSignedOut={leaveOwnerMode} />
        <Packages setBookingPreset={setBookingPreset} />
        <Testimonials reviews={reviews} />
        <Booking bookingPreset={bookingPreset} />
        <Academy />
      </main>
      <Footer links={links} />
      <FloatingWhatsApp />
      {isOwner && (
        <Suspense fallback={null}>
          <OwnerBar onSignedOut={leaveOwnerMode} />
        </Suspense>
      )}
    </>
  )
}

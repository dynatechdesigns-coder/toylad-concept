import { Cake, CalendarCheck, ChefHat, Palette, PartyPopper } from 'lucide-react'

const hero = {
  eyebrow: 'Cakes · Pastries · Events',
  title: 'Celebrations, crafted to be',
  titleAccent: 'remembered',
  subtitle:
    'From bespoke cakes and fresh pastries to stunning event styling, we bring your vision to life. Tell us the occasion and we will take care of every delicious, beautiful detail.',
  // `service` is the booking option the CTA pre-selects.
  ctas: [
    { label: 'Order Cakes & Pastries', variant: 'primary', service: 'cake', icon: Cake },
    { label: 'Plan an Event', variant: 'outline', service: 'event-management', icon: CalendarCheck },
  ],
  trustPoints: [
    { label: 'Custom designs', icon: Palette },
    { label: 'Freshly baked', icon: ChefHat },
    { label: 'Full-service events', icon: PartyPopper },
  ],
  images: {
    // Pixabay stock placeholders (see IMAGE-CREDITS.md). TODO: swap in real Toylad Concept photos.
    main: { src: '/images/hero-cake.jpg', alt: 'Tiered celebration cake dressed with roses and figs' },
    accent: { src: '/images/hero-decor.jpg', alt: 'Event table styled with pink hydrangeas and lanterns' },
  },
}

export default hero

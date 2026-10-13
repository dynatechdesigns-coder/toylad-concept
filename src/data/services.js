import { Cake, CalendarCheck, Croissant, Flower2 } from 'lucide-react'

// `id` is the booking option the card's "Enquire" link pre-selects.
const services = [
  {
    id: 'cake',
    icon: Cake,
    title: 'Custom Cakes',
    description: 'Showpiece cakes designed around your theme, flavours and guest list.',
    highlights: ['Weddings and birthdays', 'Bespoke flavours and fillings', 'Hand-finished detail'],
  },
  {
    id: 'pastries',
    icon: Croissant,
    title: 'Artisanal Pastries',
    description: 'Small chops, cupcakes and dessert boxes baked fresh for every order.',
    highlights: ['Dessert tables', 'Gift and treat boxes', 'Bulk and corporate orders'],
  },
  {
    id: 'event-decoration',
    icon: Flower2,
    title: 'Event Decoration',
    description: 'Backdrops, florals and table styling that transform any venue.',
    highlights: ['Themed backdrops', 'Floral and balloon styling', 'Table and stage setup'],
  },
  {
    id: 'event-management',
    icon: CalendarCheck,
    title: 'Full Event Management',
    description: 'Planning and on-the-day coordination, handled from start to finish.',
    highlights: ['Planning and budgeting', 'Vendor coordination', 'On-the-day supervision'],
  },
]

export default services

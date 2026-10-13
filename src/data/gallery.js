// `service` is the booking option that "Order this style" pre-selects.
export const galleryCategories = [
  { id: 'cakes', label: 'Cakes', service: 'cake' },
  { id: 'pastries', label: 'Pastries', service: 'pastries' },
  { id: 'decor', label: 'Event Decor', service: 'event-decoration' },
  { id: 'planning', label: 'Event Planning', service: 'event-management' },
]

// Images are Pixabay stock placeholders (see IMAGE-CREDITS.md).
// TODO: swap in real Toylad Concept photos.
const gallery = [
  {
    id: 'ivory-wedding-cake',
    title: 'Ivory Tiered Wedding Cake',
    category: 'cakes',
    image: '/images/gallery/ivory-wedding-cake.jpg',
    description: 'Four tiers of vanilla sponge with sugar florals and hand-piped pearl detailing.',
  },
  {
    id: 'gold-drip-birthday-cake',
    title: 'Gold Drip Birthday Cake',
    category: 'cakes',
    image: '/images/gallery/gold-drip-birthday-cake.jpg',
    description: 'Rich chocolate layers finished with a gold drip, macarons and fresh berries.',
  },
  {
    id: 'floral-buttercream-cake',
    title: 'Floral Buttercream Cake',
    category: 'cakes',
    image: '/images/gallery/floral-buttercream-cake.jpg',
    description: 'Soft pastel buttercream with a garden of hand-piped flowers, ideal for showers.',
  },
  {
    id: 'character-kids-cake',
    title: 'Character Cake for Kids',
    category: 'cakes',
    image: '/images/gallery/character-kids-cake.jpg',
    description: 'A sculpted fondant cake built around your little one’s favourite character.',
  },
  {
    id: 'signature-cupcakes',
    title: 'Signature Cupcake Dozen',
    category: 'pastries',
    image: '/images/gallery/signature-cupcakes.jpg',
    description: 'Twelve cupcakes in your choice of flavours, topped with swirled buttercream.',
  },
  {
    id: 'small-chops-platter',
    title: 'Small Chops Platter',
    category: 'pastries',
    image: '/images/gallery/small-chops-platter.jpg',
    description: 'Puff-puff, samosas, spring rolls and more, freshly made for your guests.',
  },
  {
    id: 'dessert-table-treats',
    title: 'Dessert Table Treats',
    category: 'pastries',
    image: '/images/gallery/dessert-table-treats.jpg',
    description: 'Cake pops, tarts, doughnuts and parfaits styled to match your event colours.',
  },
  {
    id: 'blush-wedding-backdrop',
    title: 'Blush & Gold Wedding Backdrop',
    category: 'decor',
    image: '/images/gallery/blush-wedding-backdrop.jpg',
    description: 'A floral arch and draped backdrop in blush, ivory and gold for the couple’s stage.',
  },
  {
    id: 'birthday-balloon-garland',
    title: 'Birthday Balloon Garland',
    category: 'decor',
    image: '/images/gallery/birthday-balloon-garland.jpg',
    description: 'An organic balloon garland with neon signage, sized to fit your space.',
  },
  {
    id: 'banquet-table-styling',
    title: 'Banquet Table Styling',
    category: 'decor',
    image: '/images/gallery/banquet-table-styling.jpg',
    description: 'Centrepieces, linen, charger plates and candlelight for an elegant dinner setting.',
  },
  {
    id: 'garden-wedding-coordination',
    title: 'Garden Wedding Coordination',
    category: 'planning',
    image: '/images/gallery/garden-wedding-coordination.jpg',
    description: 'A 200-guest outdoor wedding planned and coordinated from first call to last dance.',
  },
  {
    id: 'corporate-gala-dinner',
    title: 'Corporate Gala Dinner',
    category: 'planning',
    image: '/images/gallery/corporate-gala-dinner.jpg',
    description: 'Venue, vendors, programme and guest experience managed for an end-of-year gala.',
  },
  {
    id: 'milestone-birthday-soiree',
    title: 'Milestone Birthday Soirée',
    category: 'planning',
    image: '/images/gallery/milestone-birthday-soiree.jpg',
    description: 'An intimate 50th celebration with catering, decor and entertainment in one plan.',
  },
]

export default gallery

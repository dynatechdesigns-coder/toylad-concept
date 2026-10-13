// `service` is the booking option the group's CTAs pre-select; each tier `id` is the package value.
// TODO: every price, serving size and feature list below is a placeholder.
const packageGroups = [
  {
    id: 'cakes',
    label: 'Cake Orders',
    service: 'cake',
    tiers: [
      {
        id: 'cake-classic',
        name: 'Classic',
        priceFrom: 25000, // TODO
        covers: 'Serves 10–15 guests',
        features: ['Single-tier 8-inch cake', 'Choice of 3 flavours', 'Buttercream finish', 'Custom message topper'],
      },
      {
        id: 'cake-signature',
        name: 'Signature',
        featured: true,
        priceFrom: 60000, // TODO
        covers: 'Serves 30–40 guests',
        features: [
          'Two-tier custom design',
          'Any two flavours',
          'Fondant or buttercream finish',
          'Sugar flowers or themed toppers',
          'Design consultation',
        ],
      },
      {
        id: 'cake-luxe',
        name: 'Luxe',
        priceFrom: 150000, // TODO
        covers: 'Serves 80+ guests',
        features: [
          'Three or more tiers',
          'Premium flavours and fillings',
          'Hand-crafted sugar art',
          'Matching cupcakes or cake pops',
          'Delivery and on-site setup',
          'Tasting session',
        ],
      },
    ],
  },
  {
    id: 'pastries',
    label: 'Pastry Boxes',
    service: 'pastries',
    tiers: [
      {
        id: 'pastry-classic',
        name: 'Classic',
        priceFrom: 12000, // TODO
        covers: 'Box for 4–6 people',
        features: ['12 assorted pastries', 'Choice of 2 flavours', 'Gift-ready box', 'Pickup or delivery'],
      },
      {
        id: 'pastry-signature',
        name: 'Signature',
        featured: true,
        priceFrom: 30000, // TODO
        covers: 'Treats for 15–20 guests',
        features: [
          '36 assorted pastries',
          'Cupcakes, tarts and doughnuts',
          'Colours matched to your theme',
          'Personalised note card',
          'Same-week availability',
        ],
      },
      {
        id: 'pastry-luxe',
        name: 'Luxe',
        priceFrom: 85000, // TODO
        covers: 'Dessert table for 50+ guests',
        features: [
          '100+ mixed desserts',
          'Small chops platter',
          'Styled dessert table',
          'Stands and signage included',
          'Delivery and on-site setup',
        ],
      },
    ],
  },
  {
    id: 'decor',
    label: 'Event Decor',
    service: 'event-decoration',
    tiers: [
      {
        id: 'decor-classic',
        name: 'Classic',
        priceFrom: 80000, // TODO
        covers: 'Intimate events up to 30 guests',
        features: ['Themed backdrop', 'Balloon garland', 'Cake table styling', 'Setup and take-down'],
      },
      {
        id: 'decor-signature',
        name: 'Signature',
        featured: true,
        priceFrom: 250000, // TODO
        covers: 'Events up to 150 guests',
        features: [
          'Custom stage backdrop',
          'Guest table centrepieces',
          'Floral and balloon styling',
          'Welcome signage',
          'Colour and mood consultation',
        ],
      },
      {
        id: 'decor-luxe',
        name: 'Luxe',
        priceFrom: 600000, // TODO
        covers: 'Large events of 300+ guests',
        features: [
          'Full venue transformation',
          'Fresh floral installations',
          'Lighting and draping',
          'Luxury table settings',
          'Dedicated styling team',
          'On-the-day coordination',
        ],
      },
    ],
  },
]

export default packageGroups

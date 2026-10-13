// `service` is the booking option the group's CTAs pre-select; each tier `id` is the package value.
// TODO: every serving size and feature list below is a placeholder.
const packageGroups = [
  {
    id: 'cakes',
    label: 'Cake Orders',
    service: 'cake',
    tiers: [
      {
        id: 'cake-classic',
        name: 'Classic',
        covers: 'Serves 10–15 guests',
        features: ['Single-tier 8-inch cake', 'Choice of 3 flavours', 'Buttercream finish', 'Custom message topper'],
      },
      {
        id: 'cake-signature',
        name: 'Signature',
        featured: true,
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
        covers: 'Box for 4–6 people',
        features: ['12 assorted pastries', 'Choice of 2 flavours', 'Gift-ready box', 'Pickup or delivery'],
      },
      {
        id: 'pastry-signature',
        name: 'Signature',
        featured: true,
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
        covers: 'Intimate events up to 30 guests',
        features: ['Themed backdrop', 'Balloon garland', 'Cake table styling', 'Setup and take-down'],
      },
      {
        id: 'decor-signature',
        name: 'Signature',
        featured: true,
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

const site = {
  name: 'Toylad Concept',
  tagline: 'Cakes, pastries and celebrations, beautifully made.', // TODO: confirm tagline
  phone: '0816 155 6766',
  whatsappNumber: '2348161556766', // international format, digits only; also used for tel: links
  email: '', // TODO: add an email address (email links stay hidden while this is empty)
  locations: [
    { id: 'shop', name: 'Shop', address: 'Mini Football Field, Jikwoyi, Abuja' },
    {
      id: 'academy',
      name: 'Toylad Concept Cakes & Pastries Academy',
      address: 'By Bikaja Plaza, SS Quarters, Jikwoyi, Abuja',
    },
  ],
  hours: [
    { days: 'Monday – Friday', time: '9:00am – 6:00pm' }, // TODO: confirm hours
    { days: 'Saturday', time: '10:00am – 4:00pm' }, // TODO: confirm hours
    { days: 'Sunday', time: 'By appointment' }, // TODO: confirm hours
  ],
  // `icon` is a SocialIcon name; `label` completes "Toylad Concept on …".
  socials: [
    { id: 'instagram', icon: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/toyladconcept' },
    { id: 'tiktok', icon: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@toyladconcept' },
    {
      id: 'facebook-page',
      icon: 'facebook',
      label: 'Facebook: Toyladconcept cakes and Event',
      // TODO: replace this Facebook search link with the real page URL
      url: 'https://www.facebook.com/search/top/?q=Toyladconcept%20cakes%20and%20Event',
    },
    { id: 'facebook-alpha', icon: 'facebook', label: 'Facebook: alpha.cake', url: 'https://www.facebook.com/alpha.cake' },
  ],
  priceNote: 'Friendly price on request',
  academy: {
    eyebrow: 'Learn with us',
    title: 'Toylad Concept Cakes & Pastries Academy',
    text: 'Learn baking and pastry with us.',
    locationId: 'academy',
    cta: 'Ask about classes',
    whatsappMessage:
      'Hello Toylad Concept! I would like to ask about classes at the Cakes & Pastries Academy. Please share the details.',
  },
}

export default site

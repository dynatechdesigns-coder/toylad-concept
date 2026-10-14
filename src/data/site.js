const site = {
  name: 'Toylad Concept',
  tagline: 'Cakes, pastries and celebrations, beautifully made.', // TODO: confirm tagline
  phone: '0816 155 6766',
  whatsappNumber: '2348161556766', // international format, digits only; also used for tel: links
  email: '', // TODO: add an email address (email links stay hidden while this is empty)
  // `label` is the heading shown wherever the address is listed; `name` is an optional line under it.
  locations: [
    { id: 'shop', label: 'Shop', address: 'By Mini Football Field, Jikwoyi, Abuja.' },
    {
      id: 'school',
      label: 'Training School',
      name: 'Toylad Concept (Cakes & Pastries Academy)',
      address: 'By Bikaja Plaza, SS Quarters, Jikwoyi, Abuja.',
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
    { id: 'tiktok', icon: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@toyinomoibadan' },
    {
      id: 'facebook-page',
      icon: 'facebook',
      label: 'Facebook: Toyladconcept cakes and Event',
      url: 'https://www.facebook.com/TOYLAD1st',
    },
    { id: 'facebook-alpha', icon: 'facebook', label: 'Facebook: alpha.cake', url: 'https://www.facebook.com/alpha.cake' },
  ],
  priceNote: 'Friendly price on request',
  academy: {
    eyebrow: 'Learn with us',
    text: 'Learn baking and pastry with us.',
    locationId: 'school', // its name is the section title; its address is listed underneath
    cta: 'Ask about classes',
    whatsappMessage:
      'Hello Toylad Concept! I would like to ask about classes at the Cakes & Pastries Academy. Please share the details.',
  },
}

export default site

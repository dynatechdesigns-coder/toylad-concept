import site from './site'

// Shown under the booking form. `linkText` is the part that opens the privacy notice.
export const privacyLine = {
  text: 'We use your details to respond to your request and manage your order. We only send offers if you tick the box. See our',
  linkText: 'privacy notice',
}

// Shown under the feedback form.
export const feedbackPrivacyLine = {
  text: 'We use your feedback to improve what we do. We only show it on our website if you tick the box. See our',
  linkText: 'privacy notice',
}

// TODO: have the owner (and ideally a lawyer) confirm this wording, especially how long details are kept.
const privacyNotice = {
  title: 'Privacy notice',
  intro: `${site.name} respects your privacy and handles your details in line with the Nigeria Data Protection Act 2023.`,
  sections: [
    {
      heading: 'What we collect',
      text: 'The details you give us in the booking form or when you contact us: your name, phone number, email address (if you give one), what you would like to order, your event date and number of guests, and, only if you choose to share them, your birthday and wedding anniversary (day and month). If you leave a review, we also keep your rating and comment.',
    },
    {
      heading: 'Why we collect it',
      text: 'To reply to your request, prepare your quote, and manage and deliver your order. If you tick the box, we also use your phone number to send you occasional offers and birthday or anniversary wishes on WhatsApp. We do not send offers unless you tick the box, and we never sell your details. A review is shown on our website only if you tick the box allowing it, and then only with your first name and the first letter of your surname.',
    },
    {
      heading: 'How long we keep it',
      // TODO: confirm the retention period with the owner.
      text: 'We keep your details for up to two years after your last contact with us, so that we can serve you again without asking for everything twice. After that we delete them, unless the law requires us to keep a record for longer.',
    },
    {
      heading: 'Who can see it',
      text: 'Only Toylad Concept. Your details are stored securely with the companies that host our website and database, and your messages to us travel through WhatsApp.',
    },
    {
      heading: 'Your choices',
      text: `You can ask to see, correct or delete your details, or stop receiving offers, at any time. Send us a WhatsApp message on ${site.phone} and we will do it.`,
    },
  ],
}

export default privacyNotice

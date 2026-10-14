import site from './site'

// Wording of the public feedback page at /feedback.
export const feedbackPage = {
  eyebrow: 'Your feedback',
  title: 'How did we do?',
  intro: `Thank you for choosing ${site.name}. Tell us how it went. It takes less than a minute.`,
  ratingLabel: 'How many stars would you give us?',
  ratingWords: ['Poor', 'Not great', 'Okay', 'Good', 'Excellent'],
  commentLabel: 'Tell us more (optional)',
  commentPlaceholder: 'What did you love? What could we do better?',
  consent: 'You may show my review on your website.',
  submit: 'Send my feedback',
}

export const feedbackThanks = {
  title: 'Thank you so much!',
  text: 'Your feedback means a lot to us, and it helps us keep getting better.',
  followPrompt: 'Follow us for new cakes, treats and celebrations:',
  // Which of `site.socials` to offer after sending.
  follow: ['instagram', 'tiktok'],
}

// The WhatsApp message behind "Ask for feedback" on a delivered order. `link` is the customer's personal link.
export function feedbackRequestMessage({ name, link }) {
  return `Hello ${name.split(' ')[0]}! Thank you for ordering from ${site.name}. We hope you loved it. Could you spare a minute to tell us how we did? ${link}`
}

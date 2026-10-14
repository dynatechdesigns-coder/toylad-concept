import site from './site'

// The offer added to every greeting. Change the wording here, or set it to '' to send wishes with no offer.
export const celebrationOffer = 'Enjoy 10% off your next order this month.'

// The WhatsApp greetings. She can still edit a message in WhatsApp before pressing send.
// {name} is the customer's first name; {years} and {occasion} are only used by "event".
export const wishTemplates = {
  birthday: `Happy birthday, {name}! 🎂 Wishing you a beautiful year from all of us at ${site.name}.`,
  anniversary: `Happy wedding anniversary, {name}! 💐 Wishing you both many more wonderful years, from all of us at ${site.name}.`,
  event: `Hello {name}! It is {years} since we were part of your {occasion}. 🎉 Thank you for trusting ${site.name} with it. We would love to celebrate with you again.`,
}

// What each kind of celebration is called on screen.
export const celebrationLabels = {
  birthday: 'Birthday',
  anniversary: 'Wedding anniversary',
}

// Celebrations are listed from today up to this many days ahead. Keep in sync with api/_lib/celebrations.js.
export const CELEBRATION_DAYS = 7

const yearsText = (years) => `${years} ${years === 1 ? 'year' : 'years'}`

// "1 year since Kemi's wedding" for an event; "Birthday" or "Wedding anniversary" otherwise.
export function celebrationTitle(item) {
  if (item.kind !== 'event') return celebrationLabels[item.kind]
  return `${yearsText(item.years)} since ${item.customer.name.split(' ')[0]}’s ${item.occasion.toLowerCase()}${item.item ? ` (${item.item})` : ''}`
}

export function wishMessage(item) {
  const greeting = wishTemplates[item.kind]
    .replace('{name}', item.customer.name.split(' ')[0])
    .replace('{years}', yearsText(item.years ?? 1))
    .replace('{occasion}', (item.occasion ?? '').toLowerCase())
  return [greeting, celebrationOffer].filter(Boolean).join(' ')
}

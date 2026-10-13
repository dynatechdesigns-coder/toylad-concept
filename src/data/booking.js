import { Lightbulb, ReceiptText, Sparkles } from 'lucide-react'
import packageGroups from './packages'
import site from './site'

const c = site.currency

export const bookingIntro = {
  eyebrow: 'Booking & Custom Orders',
  title: 'Let’s create something beautiful',
  text: 'Share a few details about your celebration and we will come back with ideas, availability and a quote. No commitment needed.',
  responseTime: 'We usually reply within 2 hours during business hours.', // TODO: confirm response time
  whatsappGreeting: `Hello ${site.name}! I would like to make an enquiry.`,
}

export const bookingSteps = [
  { title: 'Tell us your idea', text: 'Share your date, theme and any inspiration photos.', icon: Lightbulb },
  { title: 'Get a quote', text: 'We send options and a clear price for your budget.', icon: ReceiptText },
  { title: 'We bake & style', text: 'Relax while we bring it all to life on the day.', icon: Sparkles },
]

export const serviceOptions = [
  { value: 'cake', label: 'Custom Cake' },
  { value: 'pastries', label: 'Pastries' },
  { value: 'event-decoration', label: 'Event Decoration' },
  { value: 'event-management', label: 'Full Event Management' },
]

// TODO: confirm budget ranges
const budgetRanges = [
  `Under ${c}50,000`,
  `${c}50,000 – ${c}150,000`,
  `${c}150,000 – ${c}500,000`,
  `${c}500,000 – ${c}1,000,000`,
  `Above ${c}1,000,000`,
  'Not sure yet',
]

// TODO: confirm available flavours
const flavours = ['Vanilla', 'Chocolate', 'Red Velvet', 'Lemon', 'Coconut', 'Fruit Cake', 'Mixed / not sure yet']
const eventTypes = ['Wedding', 'Traditional Engagement', 'Birthday', 'Baby Shower', 'Corporate Event', 'Other']
const eventServices = ['event-decoration', 'event-management']

export function packageOptionsFor(service) {
  return packageGroups
    .filter((group) => group.service === service)
    .flatMap((group) => group.tiers.map((tier) => ({ value: tier.id, label: `${group.label}: ${tier.name}` })))
}

// `showFor` limits a field to those services. `full` spans both form columns.
export const bookingFields = [
  { name: 'name', label: 'Full name', type: 'text', required: 'Please enter your full name.', autoComplete: 'name' },
  { name: 'phone', label: 'Phone', type: 'tel', required: 'Please enter your phone number.', autoComplete: 'tel' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  {
    name: 'service',
    label: 'Service',
    type: 'select',
    required: 'Please select a service.',
    placeholder: 'Select a service',
    options: serviceOptions,
  },
  { name: 'package', label: 'Package', type: 'select', placeholder: 'No package yet' },
  { name: 'date', label: 'Event date', type: 'date', required: 'Please choose your event date.' },
  { name: 'guests', label: 'Number of guests', type: 'number', min: 1, inputMode: 'numeric' },
  { name: 'budget', label: 'Budget range', type: 'select', placeholder: 'Select a range', options: budgetRanges },
  { name: 'flavour', label: 'Flavour', type: 'select', placeholder: 'Select a flavour', options: flavours, showFor: ['cake'] },
  { name: 'tiers', label: 'Number of tiers', type: 'select', placeholder: 'Select tiers', options: ['1', '2', '3', '4 or more'], showFor: ['cake'] },
  { name: 'cakeMessage', label: 'Message on cake', type: 'text', maxLength: 60, full: true, showFor: ['cake'] },
  { name: 'eventType', label: 'Event type', type: 'select', placeholder: 'Select an event type', options: eventTypes, showFor: eventServices },
  { name: 'venue', label: 'Venue / area', type: 'text', showFor: eventServices },
  {
    name: 'details',
    label: 'Details',
    type: 'textarea',
    required: 'Please tell us a little about what you need.',
    placeholder: 'Theme, colours, inspiration, delivery address…',
    full: true,
  },
]

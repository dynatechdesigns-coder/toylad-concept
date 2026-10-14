import { useEffect, useState } from 'react'
import { feedbackPage } from '../../data/feedback'
import site from '../../data/site'
import Logo from '../layout/Logo'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import FeedbackForm from './FeedbackForm'
import FeedbackThanks from './FeedbackThanks'

// A personal link looks like /feedback?o=<orderId>.
const orderId = new URLSearchParams(window.location.search).get('o') ?? ''

// The public page at /feedback. It is linked from the footer and from the owner's "Ask for feedback" messages.
export default function FeedbackPage() {
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const siteTitle = document.title
    document.title = `Feedback | ${site.name}`
    return () => {
      document.title = siteTitle
    }
  }, [])

  return (
    <div className="min-h-dvh bg-cream">
      <header className="bg-cream/90 shadow-sm">
        <Container className="flex h-16 items-center lg:h-20">
          <Logo href="/" />
        </Container>
      </header>

      <main>
        <Container className="py-12 md:py-20">
          <div className="mx-auto max-w-xl">
            {!sent && <SectionHeading align="left" eyebrow={feedbackPage.eyebrow} title={feedbackPage.title} subtitle={feedbackPage.intro} />}
            <div className={`rounded-3xl border border-espresso/10 bg-butter-soft p-6 shadow-sm md:p-10 ${sent ? '' : 'mt-8'}`}>
              {sent ? <FeedbackThanks /> : <FeedbackForm orderId={orderId} onSent={() => setSent(true)} />}
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}

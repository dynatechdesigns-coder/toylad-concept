import { useEffect, useRef } from 'react'
import { ArrowLeft, Heart } from 'lucide-react'
import { feedbackThanks } from '../../data/feedback'
import site from '../../data/site'
import Button from '../ui/Button'
import SocialIcon from '../ui/SocialIcon'

const follow = site.socials.filter((social) => feedbackThanks.follow.includes(social.id))

// Shown after a review is sent: a warm thank-you, then an invitation to follow on social media.
export default function FeedbackThanks() {
  const headingRef = useRef(null)

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div role="status" className="flex animate-pop-in flex-col items-center py-4 text-center">
      <Heart className="size-14 fill-terracotta/15 text-terracotta-deep" strokeWidth={1.25} aria-hidden="true" />
      <h2 ref={headingRef} tabIndex={-1} className="mt-6 text-3xl font-semibold focus:outline-none md:text-5xl">
        {feedbackThanks.title}
      </h2>
      <p className="mt-4 max-w-md text-base leading-relaxed text-espresso/75 md:text-lg">{feedbackThanks.text}</p>

      <p className="mt-10 text-base font-semibold text-navy">{feedbackThanks.followPrompt}</p>
      <ul className="mt-4 grid w-full gap-3 sm:grid-cols-2">
        {follow.map((social) => (
          <li key={social.id}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-teal px-6 py-3 font-semibold text-white shadow-sm transition duration-300 ease-out hover:bg-navy hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-butter-soft motion-reduce:transition-none"
            >
              <SocialIcon name={social.icon} />
              Follow us on {social.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>

      <Button href="/" variant="outline" icon={ArrowLeft} className="mt-8 min-h-12">
        Back to the website
      </Button>
    </div>
  )
}

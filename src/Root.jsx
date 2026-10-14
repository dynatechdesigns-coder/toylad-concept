import { Suspense, lazy } from 'react'
import App from './App.jsx'

// The owner's admin area lives at /admin and loads only there, so the public site stays light.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))
// The feedback page is its own small page at /feedback, also loaded only when visited.
const FeedbackPage = lazy(() => import('./components/feedback/FeedbackPage.jsx'))

const onPage = (name) => new RegExp(`^/${name}(/|$)`).test(window.location.pathname)
const Page = onPage('admin') ? AdminApp : onPage('feedback') ? FeedbackPage : null

export default function Root() {
  if (!Page) return <App />

  return (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  )
}

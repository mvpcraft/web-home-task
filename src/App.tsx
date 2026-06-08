import type { ReactNode } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import Unsubscribe from './pages/Unsubscribe'
import JoinLayout from './pages/Join/JoinLayout'
import Join from './pages/Join/Join'
import JoinTour from './pages/Join/JoinTour'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminMarketing from './pages/Admin/AdminMarketing'
import AdminAnalytics from './pages/Admin/AdminAnalytics'
import AdminUnsubscribes from './pages/Admin/AdminUnsubscribes'
import AdminEmailStats from './pages/Admin/AdminEmailStats'
import { getAdminSession } from './pages/Admin/adminAuth'

// Route guard for /admin/*. No session → bounce to /admin/login. The dashboard
// itself also re-checks on 401/403 from the API and clears the session, so a
// revoked admin can't sit on a stale token indefinitely.
function RequireAdmin({ children }: { children: ReactNode }) {
  const session = getAdminSession()
  if (!session) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

// Old onboarding split signup / live-match / welcome across separate URLs.
// We've collapsed everything into /join, but marketing emails and shared
// links in the wild still point at the old paths. Preserve query params
// (?ref=, ?utm_source=) so referral attribution survives the redirect.
function JoinRedirect() {
  const { search } = useLocation()
  return <Navigate to={`/join${search}`} replace />
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      {/* Public unsubscribe landing — reached from the marketing email link. */}
      <Route path="/unsubscribe" element={<Unsubscribe />} />
      <Route element={<JoinLayout />}>
        <Route path="/join" element={<Join />} />
        {/* /join/tour is the education-first variant for A/B testing against
            the single-page /join. Both feed the same signup endpoint and
            tag events with `flow: 'fast' | 'tour'` so admin can compare
            funnel conversion. */}
        <Route path="/join/tour" element={<JoinTour />} />
        {/* Back-compat redirects: old marketing emails / shared links pointed at
            these step-specific URLs. Forwarding with `?...` would lose query
            params, so we pass them through. */}
        <Route path="/join/signup" element={<JoinRedirect />} />
        <Route path="/join/live-match" element={<JoinRedirect />} />
        <Route path="/join/welcome" element={<JoinRedirect />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/marketing"
        element={
          <RequireAdmin>
            <AdminMarketing />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <RequireAdmin>
            <AdminAnalytics />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/unsubscribes"
        element={
          <RequireAdmin>
            <AdminUnsubscribes />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/email-stats"
        element={
          <RequireAdmin>
            <AdminEmailStats />
          </RequireAdmin>
        }
      />
    </Routes>
  )
}

export default App

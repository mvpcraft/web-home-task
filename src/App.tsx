import type { ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import JoinLayout from './pages/Join/JoinLayout'
import Join from './pages/Join/Join'
import Signup from './pages/Join/Signup'
import LiveMatch from './pages/Join/LiveMatch'
import Welcome from './pages/Join/Welcome'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminDashboard from './pages/Admin/AdminDashboard'
import { getAdminSession } from './pages/Admin/adminAuth'

// Route guard for /admin/*. No session → bounce to /admin/login. The dashboard
// itself also re-checks on 401/403 from the API and clears the session, so a
// revoked admin can't sit on a stale token indefinitely.
function RequireAdmin({ children }: { children: ReactNode }) {
  const session = getAdminSession()
  if (!session) return <Navigate to="/admin/login" replace />
  return <>{children}</>
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
      <Route element={<JoinLayout />}>
        <Route path="/join" element={<Join />} />
        <Route path="/join/signup" element={<Signup />} />
        <Route path="/join/live-match" element={<LiveMatch />} />
        <Route path="/join/welcome" element={<Welcome />} />
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
    </Routes>
  )
}

export default App

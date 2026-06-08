import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Mail, Activity, LogOut, MailX, BarChart3 } from 'lucide-react'
import { clearAdminSession, getAdminSession } from './adminAuth'
import styles from './Admin.module.css'

/**
 * Shared header bar for every page under /admin. Renders the brand, a tab
 * row for switching between dashboard sections, the signed-in email, and a
 * sign-out button. Sits at the top of each admin page rather than a layout
 * route so each page keeps full control of its own scroll container.
 */
export default function AdminNav() {
  const navigate = useNavigate()
  const session = getAdminSession()

  const handleLogout = () => {
    clearAdminSession()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className={styles.adminNav}>
      <div className={styles.adminNavBrand}>
        <span className={styles.adminNavLogo}>PlayByPlay</span>
        <span className={styles.adminNavLogoTag}>Admin</span>
      </div>

      <nav className={styles.adminNavTabs} aria-label="Admin sections">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${styles.adminNavTab} ${isActive ? styles.adminNavTabActive : ''}`
          }
        >
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            `${styles.adminNavTab} ${isActive ? styles.adminNavTabActive : ''}`
          }
        >
          <Activity size={16} />
          Analytics
        </NavLink>
        <NavLink
          to="/admin/marketing"
          className={({ isActive }) =>
            `${styles.adminNavTab} ${isActive ? styles.adminNavTabActive : ''}`
          }
        >
          <Mail size={16} />
          Marketing
        </NavLink>
        <NavLink
          to="/admin/email-stats"
          className={({ isActive }) =>
            `${styles.adminNavTab} ${isActive ? styles.adminNavTabActive : ''}`
          }
        >
          <BarChart3 size={16} />
          Email stats
        </NavLink>
        <NavLink
          to="/admin/unsubscribes"
          className={({ isActive }) =>
            `${styles.adminNavTab} ${isActive ? styles.adminNavTabActive : ''}`
          }
        >
          <MailX size={16} />
          Unsubscribes
        </NavLink>
      </nav>

      <div className={styles.adminNavMeta}>
        {session?.user.email && (
          <span className={styles.adminNavEmail} title={session.user.email}>
            {session.user.email}
          </span>
        )}
        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  )
}

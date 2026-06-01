import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { trackPageView } from '../../lib/analytics'
import styles from './Join.module.css'

export default function JoinLayout() {
  const { pathname } = useLocation()

  // Fire a page_view event whenever the user lands on a Join route.
  // Putting this in the layout means each Join page doesn't need to
  // remember to track itself - they only declare event-specific calls.
  useEffect(() => {
    trackPageView()
  }, [pathname])

  return (
    <div className={styles.shell}>
      <div className={styles.orbs} aria-hidden="true">
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      <header className={styles.topBar}>
        <Link to="/" className={styles.brand} aria-label="PlayByPlay Anime home">
          <img src="/logo.png" alt="" className={styles.brandIcon} />
          <span className={styles.brandName}>PlayByPlay Anime</span>
        </Link>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footerBar}>
        <span>&copy; {new Date().getFullYear()} PlayByPlay Anime</span>
        <div className={styles.footerLinks}>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  )
}

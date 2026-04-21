import { Link, Outlet, useLocation } from 'react-router-dom'
import { Check } from 'lucide-react'
import styles from './Join.module.css'

const STEPS = [
  { path: '/join', label: 'Welcome' },
  { path: '/join/signup', label: 'Create Account' },
  { path: '/join/welcome', label: 'Get the App' },
]

function getStepIndex(pathname: string) {
  const match = STEPS.findIndex((s) => s.path === pathname)
  return match === -1 ? 0 : match
}

export default function JoinLayout() {
  const { pathname } = useLocation()
  const current = getStepIndex(pathname)

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

        <ol className={styles.stepper} aria-label="Onboarding progress">
          {STEPS.map((step, i) => {
            const isDone = i < current
            const isActive = i === current
            return (
              <li
                key={step.path}
                className={`${styles.step} ${isActive ? styles.stepActive : ''} ${
                  isDone ? styles.stepDone : ''
                }`}
              >
                <span className={styles.stepDot}>
                  {isDone ? <Check size={14} strokeWidth={3} /> : i + 1}
                </span>
                <span className={styles.stepLabel}>{step.label}</span>
              </li>
            )
          })}
        </ol>
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

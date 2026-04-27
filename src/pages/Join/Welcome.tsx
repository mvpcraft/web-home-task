import { Link, useLocation } from 'react-router-dom'
import { Apple, Smartphone, ArrowLeft, Sparkles, Gift } from 'lucide-react'
import styles from './Join.module.css'

type InviterInfo = {
  username: string
  avatar: string
  bonusCredits: number
}

type LocationState = {
  username?: string
  email?: string
  inviter?: InviterInfo
} | null

const IOS_STORE_URL = '#'
const ANDROID_STORE_URL = '#'

export default function Welcome() {
  const location = useLocation()
  const state = location.state as LocationState
  const displayName = state?.username?.trim() || 'football fan'
  const email = state?.email
  const inviter = state?.inviter

  return (
    <div className={`${styles.card} ${styles.cardWide}`}>
      <div className={styles.successHeader}>
        <div className={styles.checkCircle}>
          <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>

        <div className={styles.badgeRow}>
          <span className={styles.badge}>
            <Gift size={14} /> 10 welcome credits added
          </span>
          <span className={styles.badge}>
            <Sparkles size={14} /> Account ready
          </span>
        </div>

        <h1 className={styles.welcomeTitle}>Welcome aboard, {displayName}!</h1>
        <p className={styles.welcomeSub}>
          Your PlayByPlay Anime account is ready and your 10 free credits are
          waiting. Install the app on your phone and sign in{' '}
          {email ? (
            <>
              with <strong style={{ color: 'var(--text)' }}>{email}</strong>
            </>
          ) : (
            <>with the email you just used</>
          )}{' '}
          to meet Victoria.
        </p>

        {inviter && (
          <div className={styles.inviteRewardBadge}>
            <Gift size={14} />
            <span>
              Your {inviter.bonusCredits}-credit bonus unlocks on your first
              credits purchase. {inviter.username} earns one too.
            </span>
          </div>
        )}
      </div>

      <div className={styles.downloadGrid}>
        <a
          href={IOS_STORE_URL}
          className={styles.storeBtn}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.storeIcon}>
            <Apple size={20} />
          </span>
          <span className={styles.storeText}>
            <span>Download on</span>
            <strong>the App Store</strong>
          </span>
        </a>

        <a
          href={ANDROID_STORE_URL}
          className={styles.storeBtn}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.storeIcon}>
            <Smartphone size={20} />
          </span>
          <span className={styles.storeText}>
            <span>Get it on</span>
            <strong>Google Play</strong>
          </span>
        </a>
      </div>

      <div className={styles.signinHint}>
        <strong>Tip.</strong> On your phone, open PlayByPlay Anime, tap{' '}
        <strong>Sign In</strong>, and enter the same email and password you used to register. Your 10 welcome credits will be ready on the Credits tab.
      </div>

      <Link to="/" className={styles.backLink}>
        <ArrowLeft size={14} /> Back to home
      </Link>
    </div>
  )
}

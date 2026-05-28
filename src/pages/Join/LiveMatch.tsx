import { useState, type ChangeEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Play, Sparkles } from 'lucide-react'
import { track } from '../../lib/analytics'
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

export default function LiveMatch() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState
  const [understood, setUnderstood] = useState(false)

  const handleContinue = () => {
    if (!understood) return
    track('live_match_continued')
    navigate('/join/welcome', { replace: true, state })
  }

  // Only emit an event when the box gets CHECKED, not on every toggle. A
  // user un-checking by accident shouldn't generate noise; the funnel only
  // cares whether they ever acknowledged the screen.
  const handleUnderstoodChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked
    setUnderstood(next)
    if (next) track('live_match_understood')
  }

  return (
    <div className={`${styles.card} ${styles.cardWide}`}>
      <span className={styles.eyebrow}>
        <Sparkles size={14} />
        ONE MORE THING
      </span>

      <h1 className={styles.title}>
        Tap a live match,{' '}
        <span className={styles.titleAccent}>meet Victoria</span>
      </h1>

      <p className={styles.lede}>
        When you open the app, the <strong>Matches</strong> tab lists every
        match that's currently in play. Any card with a red{' '}
        <strong>LIVE NOW</strong> badge is ready for commentary - tap{' '}
        <strong>Watch Live</strong> and Victoria joins you in real time, reacting
        to goals, breaking down tactics, and answering anything you ask.
      </p>

      <div className={styles.matchPreviewWrap}>
        <img
          src="/matches-preview.png"
          alt="The Matches screen showing a live Leeds vs Burnley fixture with a red LIVE NOW badge and a Watch Live button."
          className={styles.matchPreviewImage}
        />
        <div className={styles.matchPreviewGlow} aria-hidden="true" />
      </div>

      <ul className={styles.tipList}>
        <li>
          <span className={styles.tipIcon}>
            <Play size={16} />
          </span>
          <span>
            <strong>Tap Watch Live</strong> on any live match to start a
            commentary session with Victoria.
          </span>
        </li>
        <li>
          <span className={styles.tipIcon}>
            <CheckCircle2 size={16} />
          </span>
          <span>
            <strong>2 credits to enter</strong>, then 2 credits every 5 minutes
            you stay in the session.
          </span>
        </li>
        <li>
          <span className={styles.tipIcon}>
            <CheckCircle2 size={16} />
          </span>
          <span>
            <strong>Leave anytime</strong> - no extra charge until you come back
            to a new session.
          </span>
        </li>
      </ul>

      <label className={styles.checkbox} style={{ marginTop: 20, marginBottom: 20 }}>
        <input
          type="checkbox"
          checked={understood}
          onChange={handleUnderstoodChange}
        />
        <span>
          I understand - in the app, I'll tap <strong>Watch Live</strong> on a
          live match to start commentary with Victoria.
        </span>
      </label>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!understood}
        className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge} ${styles.btnBlock}`}
        aria-disabled={!understood}
      >
        Continue
        <ArrowRight size={18} />
      </button>
    </div>
  )
}

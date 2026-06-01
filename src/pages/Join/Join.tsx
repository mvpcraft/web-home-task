import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight, MessageCircle, BarChart3, ShieldCheck,
  Sparkles, Zap, Trophy, Users, Star,
  Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Gift,
  Apple, Smartphone, ArrowLeft,
} from 'lucide-react'
import { setAnalyticsUserId, track } from '../../lib/analytics'
import styles from './Join.module.css'

// Bumped each time the page is materially rewritten so we can split analytics
// between the old and new copy in the admin dashboard. Increment, don't
// rename - past variant rows in the DB stay legible.
const COPY_VARIANT = 'v4'

const IOS_STORE_URL = 'https://apps.apple.com/us/app/playbyplay-anime/id6760711721'

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || ''

type InviterInfo = {
  username: string
  avatar: string
  bonusCredits: number
}

const deriveUsername = (email: string): string => {
  const prefix = email.split('@')[0] || 'user'
  const cleaned = prefix.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 20)
  return cleaned || 'user'
}

export default function Join() {
  // Preserve marketing attribution. Marketing URLs land on /join with
  // `?utm_source=slack|discord|gmail|linkedin|…` and `?ref=...` for referrals.
  // Both feed into the signup POST so the backend can persist them.
  const [params] = useSearchParams()
  const referralCode = (params.get('ref') || '').trim()
  const utmSource = (params.get('utm_source') || '').trim()

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Success state — toggles the page from landing+form to "you're in".
  const [submitted, setSubmitted] = useState(false)
  const [createdUsername, setCreatedUsername] = useState('')

  // Inviter lookup. We validate the ref code against the backend so we can
  // show the inviter's username and reassure the new user the reward is real.
  // A failed lookup is silent - we still submit the code at signup time in
  // case it's valid and the pre-flight just failed.
  const [inviter, setInviter] = useState<InviterInfo | null>(null)

  useEffect(() => {
    if (!referralCode) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/referrals/validate?code=${encodeURIComponent(referralCode)}`,
        )
        const data = await res.json()
        if (!cancelled && data?.valid && data.inviter) {
          setInviter({
            username: data.inviter.username,
            avatar: data.inviter.avatar,
            bonusCredits: data.bonusCredits ?? 100,
          })
        }
      } catch {
        // swallow - banner just won't render
      }
    })()
    return () => {
      cancelled = true
    }
  }, [referralCode])

  const validate = (): string | null => {
    if (!email.trim()) return 'Please enter your email address.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'That email address does not look valid.'
    if (password.length < 8) return 'Password must be at least 8 characters.'
    return null
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const issue = validate()
    if (issue) {
      setError(issue)
      return
    }

    setSending(true)

    const cleanEmail = email.trim().toLowerCase()
    const username = deriveUsername(cleanEmail)

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          username,
          password,
          ...(referralCode ? { referralCode } : {}),
          ...(utmSource ? { utmSource } : {}),
        }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        let message = 'We could not create your account. Please try again.'
        try {
          const parsed = JSON.parse(text)
          if (parsed?.error || parsed?.message) {
            message = parsed.error || parsed.message
          }
        } catch {
          if (text) message = text
        }
        throw new Error(message)
      }

      const data = (await res.json().catch(() => null)) as
        | { user?: { id?: string } }
        | null
      if (data?.user?.id) {
        setAnalyticsUserId(data.user.id)
      }
      track('signup_completed', {
        hasReferral: Boolean(referralCode),
        utmSource: utmSource || null,
        variant: COPY_VARIANT,
        flow: 'fast',
      })

      setCreatedUsername(username)
      setEmail(cleanEmail)
      setSubmitted(true)
    } catch (err) {
      const msg =
        err instanceof Error && err.message
          ? err.message
          : 'We could not reach the server. Please check your connection and try again.'
      setError(msg)
    } finally {
      setSending(false)
    }
  }

  // ── Success state ─────────────────────────────────────────────────────
  if (submitted) {
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
              <Gift size={14} /> 100 welcome credits added
            </span>
            <span className={styles.badge}>
              <Sparkles size={14} /> Account ready
            </span>
          </div>

          <h1 className={styles.welcomeTitle}>Welcome aboard, {createdUsername}!</h1>
          <p className={styles.welcomeSub}>
            Your PlayByPlay Anime account is ready and your 100 free credits are
            waiting. Install the app on your phone and sign in with{' '}
            <strong style={{ color: 'var(--text)' }}>{email}</strong> to meet
            Victoria.
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
            onClick={() => track('ios_download_clicked', { location: 'join_success', flow: 'fast' })}
          >
            <span className={styles.storeIcon}>
              <Apple size={20} />
            </span>
            <span className={styles.storeText}>
              <span>Download on</span>
              <strong>the App Store</strong>
            </span>
          </a>

          {/* Android is not yet shipped - disabled with a Coming Soon tooltip.
              We still track the click so we can quantify Android demand. */}
          <span className={styles.comingSoonWrap} data-tooltip="Coming soon">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className={`${styles.storeBtn} ${styles.storeBtnDisabled}`}
              onClick={() =>
                track('android_clicked_coming_soon', { location: 'join_success', flow: 'fast' })
              }
            >
              <span className={styles.storeIcon}>
                <Smartphone size={20} />
              </span>
              <span className={styles.storeText}>
                <span>Get it on</span>
                <strong>
                  Google Play
                  <span className={styles.soonBadge}>Soon</span>
                </strong>
              </span>
            </button>
          </span>
        </div>

        <div className={styles.signinHint}>
          <strong>Tip.</strong> On your phone, open PlayByPlay Anime, tap{' '}
          <strong>Sign In</strong>, and enter the same email and password you
          used to register. Your 100 welcome credits will be ready on the Credits tab.
        </div>

        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={14} /> Back to home
        </Link>
      </div>
    )
  }

  // ── Landing + form state ──────────────────────────────────────────────
  return (
    <div className={styles.card}>
      {/* Hero visual: gives the page an instantly readable "this is Victoria"
          identity so the headline doesn't have to do all the explaining. */}
      <div className={styles.heroImageWrap} aria-hidden="true">
        <img
          src="/hero.png"
          alt=""
          className={styles.heroImage}
        />
        <div className={styles.heroImageFade} />
      </div>

      {inviter && (
        <div className={styles.inviteBanner} role="status">
          <span className={styles.inviteBannerIcon} aria-hidden="true">
            <Gift size={20} />
          </span>
          <div>
            <div className={styles.inviteBannerTitle}>
              {inviter.avatar} {inviter.username} invited you to Play by Play
            </div>
            <div className={styles.inviteBannerBody}>
              Sign up and buy any credits pack - you'll each earn{' '}
              <strong>{inviter.bonusCredits} bonus credits</strong>.
            </div>
          </div>
        </div>
      )}

      <span className={styles.eyebrow}>
        <Sparkles size={14} />
        AI FOOTBALL COMMENTARY
      </span>

      <h1 className={styles.title}>
        Watch live football with{' '}
        <span className={styles.titleAccent}>Victoria</span>, your AI anime
        commentator.
      </h1>

      <p className={styles.lede}>
        She reacts to every goal, debates calls with you out loud, and we
        predict every match before kick-off. Across 13 major leagues, including
        the World Cup 2026.
      </p>

      {/* Inline signup form. Replaces the old "click through to /join/signup"
          flow with a single-page conversion: the user reads the hero, sees
          the form right there, signs up. No extra click. */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {error && (
          <div className={styles.errorBanner} role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email address
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <Mail size={18} />
            </span>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`${styles.input} ${styles.inputWithIcon}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={sending}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Password <span className={styles.labelHint}>(8+ characters)</span>
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <Lock size={18} />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`${styles.input} ${styles.inputWithIcon}`}
              placeholder="Choose a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={sending}
              minLength={8}
              required
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className={styles.eyeBtn}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge} ${styles.btnBlock}`}
          disabled={sending}
          aria-busy={sending}
          onClick={() =>
            track('marketing_cta_clicked', {
              location: 'join_inline_form',
              target: 'signup',
              variant: COPY_VARIANT,
              flow: 'fast',
            })
          }
        >
          {sending ? (
            <>
              <Loader2 size={18} className={styles.spin} />
              Creating your account…
            </>
          ) : (
            <>
              Get 100 free credits
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <p className={styles.ctaHint}>
          <Zap size={14} /> Free account. No card. No ads. No betting. No
          subscription.
        </p>

        <p className={styles.secondaryNote} style={{ textAlign: 'center', marginTop: 4 }}>
          By creating an account you agree to our{' '}
          <Link to="/terms">Terms</Link> and{' '}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </form>

      {/* Social-proof strip: mixes a user-base claim, breadth-of-coverage,
          and a star rating to address the three things first-time visitors
          consider - is anyone using it? is it serious? is it good? */}
      <div className={styles.proofStrip}>
        <div className={styles.proofItem}>
          <Users size={16} />
          <div>
            <strong>5,000+ fans</strong>
            <span>signed up to date</span>
          </div>
        </div>
        <div className={styles.proofItem}>
          <Trophy size={16} />
          <div>
            <strong>13 leagues</strong>
            <span>EPL, La Liga, MLS, UCL</span>
          </div>
        </div>
        <div className={styles.proofItem}>
          <Star size={16} fill="currentColor" />
          <div>
            <strong>4.8 / 5</strong>
            <span>Average user rating</span>
          </div>
        </div>
      </div>

      <ul className={styles.featureList}>
        <li className={styles.featureItem}>
          <span className={styles.featureIcon}>
            <MessageCircle size={20} />
          </span>
          <div className={styles.featureBody}>
            <strong>Victoria, live in 3D</strong>
            <span>
              Reacts to goals and red cards out loud, in real time.
            </span>
          </div>
        </li>
        <li className={styles.featureItem}>
          <span className={styles.featureIcon}>
            <BarChart3 size={20} />
          </span>
          <div className={styles.featureBody}>
            <strong>AI match predictions</strong>
            <span>
              Win/draw/away odds with a written analysis. Re-opens are free.
            </span>
          </div>
        </li>
        <li className={styles.featureItem}>
          <span className={styles.featureIcon}>
            <ShieldCheck size={20} />
          </span>
          <div className={styles.featureBody}>
            <strong>Entertainment, not betting</strong>
            <span>
              No wagering, no odds markets, no ads.
            </span>
          </div>
        </li>
      </ul>
    </div>
  )
}

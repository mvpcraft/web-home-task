import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight, MessageCircle, BarChart3, ShieldCheck,
  Sparkles, Zap, Trophy, Languages,
  Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Gift,
  Apple, Smartphone, ArrowLeft, Globe,
} from 'lucide-react'
import { setAnalyticsUserId, track } from '../../lib/analytics'
import styles from './Join.module.css'

// v6: store-first layout. Primary conversion is now the App Store / Google
// Play tap (tracked as ios/android_download_clicked with location
// 'join_landing'); the email+password form is demoted to a collapsed
// secondary path. Headline re-anchored to the live World Cup. Invented
// social proof (user counts / star rating) removed until store ratings
// exist. Compare against v5 rows in admin analytics.
const COPY_VARIANT = 'v6'

const IOS_STORE_URL = 'https://apps.apple.com/us/app/playbyplay-anime/id6760711721'
const ANDROID_STORE_URL = 'https://play.google.com/store/apps/details?id=com.playbyplay.anime'

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

  // The signup form starts collapsed; the store buttons are the primary CTA.
  // Visitors who arrive with a referral code see the form open, because for
  // them the account (and the bonus) is the point of the visit.
  const [formOpen, setFormOpen] = useState(Boolean(referralCode))

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
      ; (async () => {
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

  const openForm = () => {
    setFormOpen(true)
    track('marketing_cta_clicked', {
      location: 'join_landing',
      target: 'open_signup_form',
      variant: COPY_VARIANT,
      flow: 'fast',
    })
  }

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
            onClick={() => track('ios_download_clicked', { location: 'join_success', flow: 'fast', variant: COPY_VARIANT })}
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
            onClick={() => track('android_download_clicked', { location: 'join_success', flow: 'fast', variant: COPY_VARIANT })}
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
          <strong>Sign In</strong>, and enter the same email and password you
          used to register. Your 100 welcome credits will be ready on the Credits tab.
        </div>

        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={14} /> Back to home
        </Link>
      </div>
    )
  }

  // ── Landing state: store-first ────────────────────────────────────────
  return (
    <div className={styles.card}>
      {/* Hero visual: gives the page an instantly readable "this is Victoria"
          identity so the headline doesn't have to do all the explaining. */}
      <div className={styles.heroImageWrap} aria-hidden="true">
        <img
          src="/email/playbyplay-email-hero.jpg"
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
        WORLD CUP 2026 · LIVE NOW
      </span>

      <h1 className={styles.title}>
        Watch every World Cup match with{' '}
        <span className={styles.titleAccent}>Victoria</span>, your AI anime
        commentator.
      </h1>

      <p className={styles.lede}>
        She calls the action out loud, reacts to every goal, and talks back
        when you speak. Get the app free and claim 100 welcome credits the
        moment you sign up inside it.
      </p>

      {/* PRIMARY CTA: store badges. The fastest yes a cold visitor can give
          is a store-page tap, so it comes before any form. Both taps are
          tracked, so this is also our second conversion goal made reachable
          from the landing state (previously only the success screen had it). */}
      <div className={styles.downloadGrid}>
        <a
          href={IOS_STORE_URL}
          className={styles.storeBtn}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('ios_download_clicked', { location: 'join_landing', flow: 'fast', variant: COPY_VARIANT })}
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
          onClick={() => track('android_download_clicked', { location: 'join_landing', flow: 'fast', variant: COPY_VARIANT })}
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

      <p className={styles.ctaHint}>
        <Zap size={14} /> Free app. 100 free credits. No card. No ads. No
        betting.
      </p>

      {/* SECONDARY: account creation on the web, collapsed by default.
          Useful for people on desktop right now, or referral visitors who
          want the bonus locked to an account before they install. */}
      <div className={styles.orDivider} role="separator" aria-label="or">
        <span>or</span>
      </div>

      {!formOpen ? (
        <button
          type="button"
          className={`${styles.btn} ${styles.btnGhost} ${styles.btnBlock}`}
          onClick={openForm}
        >
          <Mail size={18} />
          Create your account with email first
        </button>
      ) : (
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
                Reserve my 100 free credits
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <p className={styles.secondaryNote} style={{ textAlign: 'center', marginTop: 4 }}>
            By creating an account you agree to our{' '}
            <Link to="/terms">Terms</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </form>
      )}

      {/* Proof strip: only claims we can stand behind. The previous user
          count and star rating were unverifiable and removed for v6. */}
      <div className={styles.proofStrip}>
        <div className={styles.proofItem}>
          <Globe size={16} />
          <div>
            <strong>World Cup 2026</strong>
            <span>Live commentary now</span>
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
          <ShieldCheck size={16} />
          <div>
            <strong>No betting</strong>
            <span>No ads, no wagering</span>
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
            <Languages size={20} />
          </span>
          <div className={styles.featureBody}>
            <strong>Commentary in 7 languages</strong>
            <span>
              English, Spanish, Portuguese, Indonesian, Russian, Dutch, or Italian. The whole app follows your pick.
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
      </ul>
    </div>
  )
}

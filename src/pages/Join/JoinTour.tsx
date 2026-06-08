import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight, ArrowLeft, Sparkles, Mic, BarChart3, Trophy,
  Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Gift,
  Apple, Smartphone, CheckCircle2, MessageCircle, ShieldCheck,
  Globe, Volume2, Languages,
} from 'lucide-react'
import { setAnalyticsUserId, track, trackPageView } from '../../lib/analytics'
import shared from './Join.module.css'
import styles from './JoinTour.module.css'

// Bumped each time the tour is materially rewritten so admins can split
// analytics rows for the multi-step flow without losing earlier variants.
// v2: added the "languages" step (7 steps total).
const TOUR_VARIANT = 'tour-v2'

const IOS_STORE_URL = 'https://apps.apple.com/us/app/playbyplay-anime/id6760711721'
const ANDROID_STORE_URL = 'https://play.google.com/store/apps/details?id=com.playbyplay.anime'

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || ''

// Seven discrete steps. Steps 1-5 teach the product; step 6 takes the email;
// step 7 hands off to the iOS app. The id strings are also sent as analytics
// properties so the funnel breakdown in admin reads as names not numbers.
const STEPS = [
  { id: 'intro', kicker: 'Step 1 of 7' },
  { id: 'commentary', kicker: 'Step 2 of 7' },
  { id: 'voice', kicker: 'Step 3 of 7' },
  { id: 'languages', kicker: 'Step 4 of 7' },
  { id: 'predictions', kicker: 'Step 5 of 7' },
  { id: 'signup', kicker: 'Step 6 of 7' },
  { id: 'app', kicker: 'Step 7 of 7' },
] as const

const deriveUsername = (email: string): string => {
  const prefix = email.split('@')[0] || 'user'
  const cleaned = prefix.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 20)
  return cleaned || 'user'
}

export default function JoinTour() {
  // Marketing attribution. Same logic as Join.tsx so utm_source and ref
  // codes survive across both A/B variants for clean comparison.
  const [params] = useSearchParams()
  const referralCode = (params.get('ref') || '').trim()
  const utmSource = (params.get('utm_source') || '').trim()

  const [stepIndex, setStepIndex] = useState(0)
  const currentStep = STEPS[stepIndex]

  // Form state lives for the whole tour, not just the signup step, so users
  // who pre-fill on /join/tour?email=... see it persist if we ever add that.
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdUsername, setCreatedUsername] = useState('')

  // Per-step page view. JoinLayout fires one page_view per route change; we
  // fire additional ones here per *step* so the funnel can show drop-off
  // between intro -> commentary -> voice -> ... in the analytics dashboard.
  useEffect(() => {
    trackPageView({
      flow: 'tour',
      step: stepIndex + 1,
      stepName: currentStep.id,
      variant: TOUR_VARIANT,
    })
  }, [stepIndex, currentStep.id])

  const goNext = (target: string) => {
    track('marketing_cta_clicked', {
      location: 'join_tour',
      target,
      step: stepIndex + 1,
      stepName: currentStep.id,
      flow: 'tour',
      variant: TOUR_VARIANT,
    })
    setStepIndex(i => Math.min(i + 1, STEPS.length - 1))
  }

  const goBack = () => {
    setStepIndex(i => Math.max(i - 1, 0))
  }

  const skipToSignup = () => {
    track('marketing_cta_clicked', {
      location: 'join_tour',
      target: 'skip_to_signup',
      step: stepIndex + 1,
      stepName: currentStep.id,
      flow: 'tour',
      variant: TOUR_VARIANT,
    })
    // Jump to the signup step (index 5 = id 'signup').
    setStepIndex(5)
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
        variant: TOUR_VARIANT,
        flow: 'tour',
      })

      setCreatedUsername(username)
      setEmail(cleanEmail)
      // Advance to the final "get the app" step (index 6).
      setStepIndex(6)
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

  const cardClass = currentStep.id === 'app'
    ? `${shared.card} ${shared.cardWide}`
    : shared.card

  return (
    <div className={cardClass}>
      {/* Progress strip across the top. Visible on every step so visitors
          always know how far they are. Hidden once the account is created
          so the final "get the app" step reads as a clean success. */}
      {currentStep.id !== 'app' && (
        <div className={styles.progressWrap}>
          <span className={styles.progressCount}>{currentStep.kicker}</span>
          <div className={styles.progressTrack}>
            {STEPS.slice(0, 6).map((_, i) => (
              <span
                key={i}
                className={
                  i < stepIndex
                    ? `${styles.progressDot} ${styles.progressDotDone}`
                    : i === stepIndex
                      ? `${styles.progressDot} ${styles.progressDotActive}`
                      : styles.progressDot
                }
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.stepBody} key={currentStep.id}>
        {currentStep.id === 'intro' && (
          <IntroStep onNext={() => goNext('next_to_commentary')} onSkip={skipToSignup} />
        )}
        {currentStep.id === 'commentary' && (
          <CommentaryStep
            onBack={goBack}
            onNext={() => goNext('next_to_voice')}
            onSkip={skipToSignup}
          />
        )}
        {currentStep.id === 'voice' && (
          <VoiceStep
            onBack={goBack}
            onNext={() => goNext('next_to_languages')}
            onSkip={skipToSignup}
          />
        )}
        {currentStep.id === 'languages' && (
          <LanguagesStep
            onBack={goBack}
            onNext={() => goNext('next_to_predictions')}
            onSkip={skipToSignup}
          />
        )}
        {currentStep.id === 'predictions' && (
          <PredictionsStep
            onBack={goBack}
            onNext={() => goNext('next_to_signup')}
            onSkip={skipToSignup}
          />
        )}
        {currentStep.id === 'signup' && (
          <SignupStep
            email={email}
            password={password}
            showPassword={showPassword}
            sending={sending}
            error={error}
            onEmail={setEmail}
            onPassword={setPassword}
            onTogglePassword={() => setShowPassword(v => !v)}
            onBack={goBack}
            onSubmit={handleSubmit}
          />
        )}
        {currentStep.id === 'app' && (
          <AppStep username={createdUsername} email={email} />
        )}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────
   Step 1 — Meet Victoria
   Sets the hook: who she is, what she does, why this is different.
   ────────────────────────────────────────── */
function IntroStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  return (
    <>
      <div className={styles.introHero} aria-hidden="true">
        <img src="/hero.png" alt="" />
      </div>

      <span className={styles.stepKicker}>Meet your commentator</span>
      <h1 className={styles.stepTitle}>
        Watch live football with{' '}
        <span className={styles.stepTitleAccent}>Victoria</span>, your AI anime
        commentator.
      </h1>
      <p>
        She is a 3D anime character who joins you in live match rooms, reacts
        to every goal out loud, and answers when you talk back. Built for fans
        who watch alone and want a co-viewer who actually shows up.
      </p>

      <div className={styles.introBadges}>
        <span className={styles.introBadge}>
          <Sparkles size={14} /> Real anime avatar
        </span>
        <span className={styles.introBadge}>
          <Trophy size={14} /> 13 leagues
        </span>
        <span className={styles.introBadge}>
          <ShieldCheck size={14} /> No ads, no betting
        </span>
      </div>

      <div className={`${styles.navRow} ${styles.navRowSolo}`}>
        <button
          type="button"
          onClick={onSkip}
          className={styles.skipLink}
        >
          Skip the tour, just sign me up
        </button>
        <button
          type="button"
          onClick={onNext}
          className={`${shared.btn} ${shared.btnPrimary} ${shared.btnLarge}`}
        >
          See how she works <ArrowRight size={18} />
        </button>
      </div>
    </>
  )
}

/* ──────────────────────────────────────────
   Step 2 — Live commentary
   Shows a transcript of what Victoria actually says during a goal, plus the
   5 emotion states so visitors see this is more than a TTS toy.
   ────────────────────────────────────────── */
function CommentaryStep({
  onBack, onNext, onSkip,
}: {
  onBack: () => void; onNext: () => void; onSkip: () => void
}) {
  return (
    <>
      <span className={styles.stepKicker}>Live commentary</span>
      <h1 className={styles.stepTitle}>
        She calls the match, <span className={styles.stepTitleAccent}>out loud</span>.
      </h1>
      <p>
        Victoria reacts in real time to every goal, card, and big moment. Her
        face shifts between five emotions as the match unfolds, and her voice
        rises and falls with the action.
      </p>

      <div className={styles.transcript}>
        <div className={styles.transcriptHeader}>
          <span className={styles.liveDot}>LIVE</span>
          <span>Man City 1 - 0 Liverpool · 78'</span>
        </div>

        <div className={styles.transcriptLine}>
          <div className={styles.transcriptAvatar}>V</div>
          <div className={styles.transcriptText}>
            "Bellingham, threading the needle... Saka is one on one with the keeper!"
          </div>
        </div>

        <div className={styles.transcriptLine}>
          <div className={styles.transcriptAvatar}>V</div>
          <div className={styles.transcriptText}>
            <em>"GOOOAL!"</em> She buries it!
            <span className={styles.transcriptTag}>Excited</span>
          </div>
        </div>

        <div className={styles.transcriptLine}>
          <div className={styles.transcriptAvatar}>V</div>
          <div className={styles.transcriptText}>
            "That is pure composure. Three touches and the back of the net."
          </div>
        </div>
      </div>

      <div className={styles.emotionRow}>
        <span className={styles.emotionChip}><span>🤩</span> Excited</span>
        <span className={styles.emotionChip}><span>😱</span> Shocked</span>
        <span className={styles.emotionChip}><span>😊</span> Happy</span>
        <span className={styles.emotionChip}><span>😔</span> Sad</span>
        <span className={styles.emotionChip}><span>😬</span> Tense</span>
      </div>

      <div className={styles.navRow}>
        <button
          type="button"
          onClick={onBack}
          className={`${shared.btn} ${shared.btnGhost}`}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" onClick={onSkip} className={styles.skipLink}>
            Skip
          </button>
          <button
            type="button"
            onClick={onNext}
            className={`${shared.btn} ${shared.btnPrimary}`}
          >
            Next <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  )
}

/* ──────────────────────────────────────────
   Step 3 — Voice talk-back
   Demonstrates two-way conversation so visitors understand this isn't a
   one-way TTS feed - they can interrupt and ask things.
   ────────────────────────────────────────── */
function VoiceStep({
  onBack, onNext, onSkip,
}: {
  onBack: () => void; onNext: () => void; onSkip: () => void
}) {
  return (
    <>
      <span className={styles.stepKicker}>Two-way voice</span>
      <h1 className={styles.stepTitle}>
        <span className={styles.stepTitleAccent}>Talk back.</span> She listens.
      </h1>
      <p>
        Tap the mic and just talk. Victoria transcribes you on the fly and
        replies out loud, in her own voice. Ask about a player. Debate a
        ref decision. Or just yell at her when your team scores.
      </p>

      <div className={styles.voiceDemo}>
        <div className={`${styles.voiceBubble} ${styles.voiceBubbleUser}`}>
          <span className={styles.voiceBubbleLabel}>
            <Mic size={11} style={{ display: 'inline', verticalAlign: -1 }} /> You
          </span>
          Why didn't he pass to Foden? He was wide open.
        </div>
        <div className={`${styles.voiceBubble} ${styles.voiceBubbleVictoria}`}>
          <span className={styles.voiceBubbleLabel}>
            <Volume2 size={11} style={{ display: 'inline', verticalAlign: -1 }} /> Victoria
          </span>
          Honestly? Tunnel vision. He saw the keeper off his line and just had
          to try. Forgivable on a striker's instinct, but a captain spots Foden.
        </div>

        <div className={styles.micRow}>
          <div className={styles.micPulse}>
            <Mic size={14} />
          </div>
          <span>Hold to speak · she replies in real time</span>
        </div>
      </div>

      <div className={styles.navRow}>
        <button
          type="button"
          onClick={onBack}
          className={`${shared.btn} ${shared.btnGhost}`}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" onClick={onSkip} className={styles.skipLink}>
            Skip
          </button>
          <button
            type="button"
            onClick={onNext}
            className={`${shared.btn} ${shared.btnPrimary}`}
          >
            Next <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  )
}

/* ──────────────────────────────────────────
   Step 4 — Languages
   Shows the seven supported languages so visitors know the commentary and the
   whole app are not English-only, and that it auto-matches their device.
   ────────────────────────────────────────── */
function LanguagesStep({
  onBack, onNext, onSkip,
}: {
  onBack: () => void; onNext: () => void; onSkip: () => void
}) {
  return (
    <>
      <span className={styles.stepKicker}>Your language</span>
      <h1 className={styles.stepTitle}>
        Victoria speaks <span className={styles.stepTitleAccent}>your language</span>.
      </h1>
      <p>
        Live commentary and the entire app come in seven languages. Pick one and
        Victoria calls the match in it while every screen follows. On first
        launch the app matches your phone, and you can switch any time from your
        profile.
      </p>

      <div className={styles.introBadges}>
        <span className={styles.introBadge}>
          <Languages size={14} /> 7 languages
        </span>
        <span className={styles.introBadge}>
          <Globe size={14} /> Auto-matched on first launch
        </span>
      </div>

      <div className={styles.emotionRow}>
        <span className={styles.emotionChip}><span>🇬🇧</span> English</span>
        <span className={styles.emotionChip}><span>🇪🇸</span> Español</span>
        <span className={styles.emotionChip}><span>🇵🇹</span> Português</span>
        <span className={styles.emotionChip}><span>🇮🇩</span> Indonesia</span>
        <span className={styles.emotionChip}><span>🇷🇺</span> Русский</span>
        <span className={styles.emotionChip}><span>🇳🇱</span> Nederlands</span>
        <span className={styles.emotionChip}><span>🇮🇹</span> Italiano</span>
      </div>

      <div className={styles.navRow}>
        <button
          type="button"
          onClick={onBack}
          className={`${shared.btn} ${shared.btnGhost}`}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" onClick={onSkip} className={styles.skipLink}>
            Skip
          </button>
          <button
            type="button"
            onClick={onNext}
            className={`${shared.btn} ${shared.btnPrimary}`}
          >
            Next <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  )
}

/* ──────────────────────────────────────────
   Step 5 — AI predictions
   Shows the prediction bar visualisation plus a snippet of the reasoning
   so it's clear this isn't a number-only output.
   ────────────────────────────────────────── */
function PredictionsStep({
  onBack, onNext, onSkip,
}: {
  onBack: () => void; onNext: () => void; onSkip: () => void
}) {
  return (
    <>
      <span className={styles.stepKicker}>Match predictions</span>
      <h1 className={styles.stepTitle}>
        AI predictions before <span className={styles.stepTitleAccent}>kick-off</span>.
      </h1>
      <p>
        One credit, any upcoming fixture. You get home, draw, and away
        probabilities, plus a short written analysis that actually explains
        the reasoning. Re-opens are free.
      </p>

      <div className={styles.predictionCard}>
        <div className={styles.predictionMatchup}>
          <span>Man City vs Liverpool</span>
          <span>Sat · 17:30</span>
        </div>

        <div className={styles.predictionBar}>
          <div
            className={`${styles.predictionSegment} ${styles.predictionSegmentHome}`}
            style={{ width: '42%' }}
          >
            42%
          </div>
          <div
            className={`${styles.predictionSegment} ${styles.predictionSegmentDraw}`}
            style={{ width: '24%' }}
          >
            24%
          </div>
          <div
            className={`${styles.predictionSegment} ${styles.predictionSegmentAway}`}
            style={{ width: '34%' }}
          >
            34%
          </div>
        </div>

        <div className={styles.predictionLegend}>
          <span>City win</span>
          <span>Draw</span>
          <span>Liverpool win</span>
        </div>

        <div className={styles.predictionNote}>
          <strong>Why these numbers?</strong> City have won four of their last
          five at the Etihad, but Liverpool's away form since January has been
          their strongest under Slot. The midfield battle decides this one.
        </div>
      </div>

      <div className={styles.navRow}>
        <button
          type="button"
          onClick={onBack}
          className={`${shared.btn} ${shared.btnGhost}`}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" onClick={onSkip} className={styles.skipLink}>
            Skip
          </button>
          <button
            type="button"
            onClick={onNext}
            className={`${shared.btn} ${shared.btnPrimary}`}
          >
            Create my account <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  )
}

/* ──────────────────────────────────────────
   Step 6 — Signup form
   Mirrors the inline form on /join. Same backend, same validation. Adds a
   small recap strip above the form to remind users what they're getting.
   ────────────────────────────────────────── */
function SignupStep({
  email, password, showPassword, sending, error,
  onEmail, onPassword, onTogglePassword, onBack, onSubmit,
}: {
  email: string
  password: string
  showPassword: boolean
  sending: boolean
  error: string | null
  onEmail: (v: string) => void
  onPassword: (v: string) => void
  onTogglePassword: () => void
  onBack: () => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <>
      <span className={styles.stepKicker}>Create your account</span>
      <h1 className={styles.stepTitle}>
        Claim your <span className={styles.stepTitleAccent}>100 free credits</span>.
      </h1>
      <p>
        Email and a password. That's it. Your credits land before you finish
        the next sip of your drink.
      </p>

      <div className={styles.recapStrip}>
        <div className={styles.recapItem}>
          <MessageCircle size={18} />
          <strong>Live commentary</strong>
          <span>With Victoria</span>
        </div>
        <div className={styles.recapItem}>
          <BarChart3 size={18} />
          <strong>AI predictions</strong>
          <span>Cached, no re-charge</span>
        </div>
        <div className={styles.recapItem}>
          <Globe size={18} />
          <strong>13 leagues</strong>
          <span>EPL, La Liga, WC 2026</span>
        </div>
      </div>

      <form className={shared.form} onSubmit={onSubmit} noValidate>
        {error && (
          <div className={shared.errorBanner} role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        <div className={shared.field}>
          <label htmlFor="tour-email" className={shared.label}>
            Email address
          </label>
          <div className={shared.inputWrap}>
            <span className={shared.inputIcon}>
              <Mail size={18} />
            </span>
            <input
              id="tour-email"
              type="email"
              autoComplete="email"
              className={`${shared.input} ${shared.inputWithIcon}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => onEmail(e.target.value)}
              disabled={sending}
              required
            />
          </div>
        </div>

        <div className={shared.field}>
          <label htmlFor="tour-password" className={shared.label}>
            Password <span className={shared.labelHint}>(8+ characters)</span>
          </label>
          <div className={shared.inputWrap}>
            <span className={shared.inputIcon}>
              <Lock size={18} />
            </span>
            <input
              id="tour-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`${shared.input} ${shared.inputWithIcon}`}
              placeholder="Choose a strong password"
              value={password}
              onChange={(e) => onPassword(e.target.value)}
              disabled={sending}
              minLength={8}
              required
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={onTogglePassword}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className={shared.eyeBtn}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className={styles.navRow}>
          <button
            type="button"
            onClick={onBack}
            className={`${shared.btn} ${shared.btnGhost}`}
            disabled={sending}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button
            type="submit"
            className={`${shared.btn} ${shared.btnPrimary} ${shared.btnLarge}`}
            disabled={sending}
            aria-busy={sending}
            onClick={() =>
              track('marketing_cta_clicked', {
                location: 'join_tour',
                target: 'signup',
                step: 5,
                stepName: 'signup',
                flow: 'tour',
                variant: TOUR_VARIANT,
              })
            }
          >
            {sending ? (
              <>
                <Loader2 size={18} className={shared.spin} /> Creating…
              </>
            ) : (
              <>
                Get 100 free credits <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        <p className={shared.secondaryNote} style={{ textAlign: 'center' }}>
          By creating an account you agree to our{' '}
          <Link to="/terms">Terms</Link> and{' '}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </form>
    </>
  )
}

/* ──────────────────────────────────────────
   Step 7 — Get the app
   Mirrors the success state from Join.tsx so visitors who arrive via either
   variant land in the same familiar place. iOS link is live; Android is
   gated behind a Coming Soon tooltip, with click still tracked.
   ────────────────────────────────────────── */
function AppStep({ username, email }: { username: string; email: string }) {
  return (
    <>
      <div className={shared.successHeader}>
        <div className={shared.checkCircle}>
          <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>

        <div className={shared.badgeRow}>
          <span className={shared.badge}>
            <Gift size={14} /> 100 welcome credits added
          </span>
          <span className={shared.badge}>
            <CheckCircle2 size={14} /> Account ready
          </span>
        </div>

        <h1 className={shared.welcomeTitle}>
          You're in, {username}!
        </h1>
        <p className={shared.welcomeSub}>
          Your PlayByPlay Anime account is live and your 100 free credits are
          waiting. Install the app and sign in with{' '}
          <strong style={{ color: 'var(--text)' }}>{email}</strong> to meet
          Victoria for the first time.
        </p>
      </div>

      <div className={shared.downloadGrid}>
        <a
          href={IOS_STORE_URL}
          className={shared.storeBtn}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            track('ios_download_clicked', {
              location: 'join_tour_app_step',
              flow: 'tour',
              variant: TOUR_VARIANT,
            })
          }
        >
          <span className={shared.storeIcon}>
            <Apple size={20} />
          </span>
          <span className={shared.storeText}>
            <span>Download on</span>
            <strong>the App Store</strong>
          </span>
        </a>

        <a
          href={ANDROID_STORE_URL}
          className={shared.storeBtn}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            track('android_download_clicked', {
              location: 'join_tour_app_step',
              flow: 'tour',
              variant: TOUR_VARIANT,
            })
          }
        >
          <span className={shared.storeIcon}>
            <Smartphone size={20} />
          </span>
          <span className={shared.storeText}>
            <span>Get it on</span>
            <strong>Google Play</strong>
          </span>
        </a>
      </div>

      <div className={shared.signinHint}>
        <strong>Tip.</strong> On your phone, open PlayByPlay Anime, tap{' '}
        <strong>Sign In</strong>, and enter the same email and password you
        used to register. Your 100 welcome credits will be on the Credits tab.
      </div>

      <Link to="/" className={shared.backLink}>
        <ArrowLeft size={14} /> Back to home
      </Link>
    </>
  )
}

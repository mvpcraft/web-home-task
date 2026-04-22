import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import styles from './Join.module.css'

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || ''

const deriveUsername = (email: string): string => {
  const prefix = email.split('@')[0] || 'user'
  const cleaned = prefix.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 20)
  return cleaned || 'user'
}

export default function Signup() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validate = (): string | null => {
    if (!email.trim()) return 'Please enter your email address.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'That email address does not look valid.'
    if (password.length < 8) return 'Password must be at least 8 characters.'
    if (confirmPassword !== password) return 'Passwords do not match. Please re-enter them.'
    if (!acceptTerms) return 'Please accept the Terms and Privacy Policy to continue.'
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

      navigate('/join/welcome', {
        replace: true,
        state: { username, email: cleanEmail },
      })
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

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Create your free account</h1>
      <p className={styles.lede}>
        No card required. Sign up once and sign into the mobile app with the
        same email.
      </p>

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

        <div className={styles.field}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm password
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <Lock size={18} />
            </span>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`${styles.input} ${styles.inputWithIcon}`}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={sending}
              minLength={8}
              required
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              className={styles.eyeBtn}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {confirmPassword.length > 0 && confirmPassword !== password && (
            <p className={styles.helpText} style={{ color: 'var(--error)' }}>
              Passwords do not match yet.
            </p>
          )}
        </div>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            disabled={sending}
          />
          <span>
            I agree to the <Link to="/terms">Terms of Service</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>.
          </span>
        </label>

        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge} ${styles.btnBlock}`}
          disabled={sending}
          aria-busy={sending}
        >
          {sending ? (
            <>
              <Loader2 size={18} className={styles.spin} />
              Creating your account…
            </>
          ) : (
            <>
              Create account
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <p className={styles.secondaryNote} style={{ textAlign: 'center', marginTop: 4 }}>
          Already have an account? Open the mobile app and sign in.
        </p>
      </form>
    </div>
  )
}

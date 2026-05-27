import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, AlertCircle, Loader2, Shield } from 'lucide-react'
import {
  ADMIN_API_BASE,
  getAdminSession,
  setAdminSession,
  type AdminUser,
} from './adminAuth'
import styles from './Admin.module.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If an admin session already exists, skip the form.
  useEffect(() => {
    if (getAdminSession()) {
      navigate('/admin', { replace: true })
    }
  }, [navigate])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }

    setSending(true)
    try {
      // Reuses the standard login endpoint. Admin-vs-user separation happens
      // here on the client: we accept the token only if the returned user has
      // role === 'admin'. The /api/admin/* routes also enforce it server-side.
      const res = await fetch(`${ADMIN_API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })
      const data = await res.json()

      if (!res.ok || !data?.success) {
        setError(data?.message || 'Invalid email or password.')
        return
      }

      const user = data.user as AdminUser & { role: string }
      if (user?.role !== 'admin') {
        // Generic message - don't leak whether the email maps to a real user.
        setError('This account does not have admin access.')
        return
      }

      setAdminSession({ token: data.token, user })
      navigate('/admin', { replace: true })
    } catch {
      setError('We could not reach the server. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={styles.loginShell}>
      <div className={styles.loginCard}>
        <div className={styles.loginBadge}>
          <Shield size={18} />
          <span>Admin access</span>
        </div>

        <h1 className={styles.loginTitle}>Sign in to PlayByPlay Admin</h1>
        <p className={styles.loginLede}>
          This area is restricted to operators. Use the admin email and password
          provisioned for your account.
        </p>

        <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
          {error && (
            <div className={styles.errorBanner} role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <span className={styles.inputWrap}>
              <span className={styles.inputIcon}>
                <Mail size={18} />
              </span>
              <input
                type="email"
                autoComplete="username"
                className={styles.input}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@playbyplayai.org"
                disabled={sending}
                required
              />
            </span>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            <span className={styles.inputWrap}>
              <span className={styles.inputIcon}>
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className={styles.input}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                disabled={sending}
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>

          <button
            type="submit"
            className={styles.loginBtn}
            disabled={sending}
            aria-busy={sending}
          >
            {sending ? (
              <>
                <Loader2 size={18} className={styles.spin} />
                Signing in…
              </>
            ) : (
              <>Sign in</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

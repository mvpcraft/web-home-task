import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || ''

type State = 'loading' | 'done' | 'error'

/**
 * Public landing for the unsubscribe link in marketing emails. Reads the email
 * and signed token from the query string, POSTs them to the backend (which
 * verifies the token and records the opt-out), then shows a confirmation.
 */
export default function Unsubscribe() {
  const [params] = useSearchParams()
  const email = (params.get('email') || '').trim()
  const token = (params.get('token') || '').trim()

  const [state, setState] = useState<State>('loading')
  const [message, setMessage] = useState('')
  // Guard against React StrictMode double-invoking the effect in dev.
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    if (!email || !token) {
      setState('error')
      setMessage('This unsubscribe link is incomplete. Please use the link from your email.')
      return
    }

    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/marketing/unsubscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token }),
        })
        const data = await res.json().catch(() => null)
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || 'We could not process your request.')
        }
        setState('done')
      } catch (err) {
        setState('error')
        setMessage(err instanceof Error ? err.message : 'We could not process your request.')
      }
    })()
  }, [email, token])

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <span style={{ color: '#1E90FF' }}>Play</span>
          <span style={{ color: '#FFFFFF' }}>By</span>
          <span style={{ color: '#FF4081' }}>Play</span>
          <span style={{ color: '#FFFFFF', opacity: 0.7 }}> Anime</span>
        </div>

        {state === 'loading' && (
          <>
            <Loader2 size={36} color="#1E90FF" style={{ ...styles.icon, animation: 'pbpspin 1s linear infinite' }} />
            <h1 style={styles.title}>Updating your preferences…</h1>
            <p style={styles.body}>One moment while we process your request.</p>
          </>
        )}

        {state === 'done' && (
          <>
            <CheckCircle2 size={44} color="#3DD968" style={styles.icon} />
            <h1 style={styles.title}>You're unsubscribed</h1>
            <p style={styles.body}>
              {email ? <strong style={{ color: '#FFFFFF' }}>{email}</strong> : 'Your email'} has been
              removed from our marketing list. You won't receive these emails again. Account and
              transactional messages (like password resets) are not affected.
            </p>
          </>
        )}

        {state === 'error' && (
          <>
            <AlertCircle size={44} color="#FF4D5E" style={styles.icon} />
            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.body}>{message}</p>
          </>
        )}

        <Link to="/" style={styles.link}>Back to home</Link>
      </div>

      {/* Keyframes for the loading spinner (inline styles can't define @keyframes). */}
      <style>{'@keyframes pbpspin { to { transform: rotate(360deg) } }'}</style>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0A0E27',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  card: {
    width: '100%',
    maxWidth: 460,
    background: '#0F1430',
    border: '1px solid rgba(30,144,255,0.18)',
    borderRadius: 16,
    padding: '40px 32px',
    textAlign: 'center',
  },
  brand: { fontSize: 18, fontWeight: 800, letterSpacing: 0.4, marginBottom: 24 },
  icon: { margin: '0 auto 16px' },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 800, margin: '0 0 10px' },
  body: { color: '#C4CBE8', fontSize: 15, lineHeight: '23px', margin: '0 0 24px' },
  link: { color: '#1E90FF', fontSize: 14, fontWeight: 700, textDecoration: 'none' },
}

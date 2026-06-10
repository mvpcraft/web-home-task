import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mail, Send, Loader2, AlertCircle, CheckCircle2, FileText, Users, LayoutTemplate,
} from 'lucide-react'
import AdminNav from './AdminNav'
import {
  ADMIN_API_BASE,
  clearAdminSession,
  getAdminSession,
} from './adminAuth'
import styles from './Admin.module.css'

interface SendResult {
  sent: number
  failed: number
  skipped: number
  total: number
  failures: { email: string; reason: string }[]
}

const DEFAULT_SUBJECT = 'Meet Victoria - your new AI football commentator'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Parse the textarea contents into individual recipient strings.
 * Accepts one-per-line, comma-separated, semicolon-separated, or any mix.
 * Returns `{ valid, invalid }` so the UI can preview both totals before send.
 */
function parseEmails(raw: string): { valid: string[]; invalid: string[] } {
  const tokens = raw.split(/[\s,;]+/).map(t => t.trim()).filter(Boolean)
  const seen = new Set<string>()
  const valid: string[] = []
  const invalid: string[] = []
  for (const t of tokens) {
    // Pull the address out of "Name <a@b.com>" pastes.
    const angle = /<([^>]+)>/.exec(t)
    const candidate = (angle ? angle[1] : t).toLowerCase()
    if (!EMAIL_RE.test(candidate)) {
      invalid.push(t)
      continue
    }
    if (seen.has(candidate)) continue
    seen.add(candidate)
    valid.push(candidate)
  }
  return { valid, invalid }
}

export default function AdminMarketing() {
  const navigate = useNavigate()
  const session = getAdminSession()

  const [emailsRaw, setEmailsRaw] = useState('')
  const [subject, setSubject] = useState(DEFAULT_SUBJECT)
  const [template, setTemplate] = useState<'v1' | 'v2'>('v1')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SendResult | null>(null)

  // Bounce to login if the admin token disappeared while this tab was idle.
  useEffect(() => {
    if (!session) navigate('/admin/login', { replace: true })
  }, [session, navigate])

  const { valid, invalid } = useMemo(() => parseEmails(emailsRaw), [emailsRaw])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!session) return
    if (valid.length === 0) {
      setError('Add at least one valid email address.')
      return
    }

    // Confirm before firing a blast - this hits real inboxes.
    const ok = window.confirm(
      `Send the marketing email to ${valid.length} recipient${valid.length === 1 ? '' : 's'}?\n\n` +
        `Template: ${template.toUpperCase()}\n` +
        `Subject: ${subject || DEFAULT_SUBJECT}`,
    )
    if (!ok) return

    setSending(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${ADMIN_API_BASE}/api/admin/email/marketing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ emails: valid, subject: subject.trim() || undefined, template }),
      })

      if (res.status === 401 || res.status === 403) {
        clearAdminSession()
        navigate('/admin/login', { replace: true })
        return
      }

      const data = await res.json()
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Send failed')
      }
      setResult({
        sent: data.sent,
        failed: data.failed,
        skipped: data.skipped,
        total: data.total,
        failures: data.failures || [],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Send failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={styles.dashShell}>
      <AdminNav />

      <header className={styles.dashHeader} style={{ marginTop: 28 }}>
        <div>
          <h1 className={styles.dashTitle}>Marketing email</h1>
          <p className={styles.dashSub}>
            Pick a template (v1 or v2) and send it to a list of recipients via
            Resend. Templates live in{' '}
            <code>play_by_play_backend/templates/</code> - edit those files to
            update the copy.
          </p>
        </div>
      </header>

      {error && (
        <div className={styles.errorBanner} role="alert" style={{ marginBottom: 16 }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className={styles.section} style={{ borderColor: 'rgba(0, 230, 118, 0.35)' }}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={20} color="#3DD968" />
              Blast complete
            </h2>
            <p className={styles.sectionSub}>
              <strong style={{ color: '#3DD968' }}>{result.sent}</strong> sent
              {' / '}
              <strong style={{ color: '#FF4D5E' }}>{result.failed}</strong> failed
              {' / '}
              <strong>{result.skipped}</strong> duplicates skipped
              {' / '}
              <strong>{result.total}</strong> attempted total.
            </p>
          </div>

          {result.failures.length > 0 && (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {result.failures.map((f, i) => (
                    <tr key={`${f.email}-${i}`}>
                      <td>{f.email}</td>
                      <td>{f.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <form className={styles.section} onSubmit={handleSubmit}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Compose</h2>
          <p className={styles.sectionSub}>
            Paste one or many recipient emails - one per line, or comma /
            semicolon separated. Duplicates and invalid entries are filtered
            automatically.
          </p>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>
            <LayoutTemplate size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Template
          </span>
          <select
            className={styles.input}
            value={template}
            onChange={e => setTemplate(e.target.value as 'v1' | 'v2')}
            disabled={sending}
            style={{ colorScheme: 'dark', cursor: 'pointer' }}
          >
            <option value="v1">v1 — Original (feature grid)</option>
            <option value="v2">v2 — Language-first (short)</option>
          </select>
          <span className={styles.recipientHint} style={{ marginTop: 6 }}>
            Edit the files in <code>play_by_play_backend/templates/</code>:
            {' '}<code>marketing_email.html</code> (v1),{' '}
            <code>marketing_email_v2.html</code> (v2).
          </span>
        </label>

        <label className={styles.field} style={{ marginTop: 16 }}>
          <span className={styles.label}>Subject</span>
          <span className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <FileText size={18} />
            </span>
            <input
              type="text"
              className={styles.input}
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder={DEFAULT_SUBJECT}
              disabled={sending}
              maxLength={200}
            />
          </span>
        </label>

        <label className={styles.field} style={{ marginTop: 16 }}>
          <span className={styles.label}>
            <Mail size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Recipients
          </span>
          <textarea
            className={styles.textarea}
            value={emailsRaw}
            onChange={e => setEmailsRaw(e.target.value)}
            placeholder={
              'one@example.com\n' +
              'two@example.com, three@example.com\n' +
              '"Jane Doe" <jane@example.com>'
            }
            rows={10}
            disabled={sending}
          />
        </label>

        <div className={styles.recipientMeta}>
          <span className={styles.recipientChip}>
            <Users size={14} />
            <strong>{valid.length}</strong> valid
          </span>
          {invalid.length > 0 && (
            <span className={`${styles.recipientChip} ${styles.recipientChipBad}`}>
              <AlertCircle size={14} />
              <strong>{invalid.length}</strong> rejected
            </span>
          )}
          {invalid.length > 0 && (
            <span className={styles.recipientHint}>
              Rejected: {invalid.slice(0, 3).join(', ')}
              {invalid.length > 3 ? ` +${invalid.length - 3} more` : ''}
            </span>
          )}
        </div>

        <button
          type="submit"
          className={styles.loginBtn}
          disabled={sending || valid.length === 0}
          aria-busy={sending}
          style={{ marginTop: 18 }}
        >
          {sending ? (
            <>
              <Loader2 size={18} className={styles.spin} />
              Sending to {valid.length} recipient{valid.length === 1 ? '' : 's'}…
            </>
          ) : (
            <>
              <Send size={18} />
              Send to {valid.length || 0} recipient{valid.length === 1 ? '' : 's'}
            </>
          )}
        </button>
      </form>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle, Loader2, RefreshCw, Send, MailCheck, Eye, MousePointerClick, MailWarning,
} from 'lucide-react'
import AdminNav from './AdminNav'
import { ADMIN_API_BASE, clearAdminSession, getAdminSession } from './adminAuth'
import styles from './Admin.module.css'

interface RecipientStat {
  email: string
  subject: string | null
  delivered: boolean
  opened: boolean
  clicked: boolean
  bounced: boolean
  lastType: string
  lastAt: string
}

interface Stats {
  totals: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    bounced: number
    complained: number
  }
  openRate: number
  clickRate: number
  recipients: RecipientStat[]
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminEmailStats() {
  const navigate = useNavigate()
  const token = getAdminSession()?.token

  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!token) {
      navigate('/admin/login', { replace: true })
      return
    }
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${ADMIN_API_BASE}/api/admin/email-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 401 || res.status === 403) {
          clearAdminSession()
          navigate('/admin/login', { replace: true })
          return
        }
        const data = await res.json()
        if (!res.ok || !data?.success) throw new Error(data?.message || 'Failed to load email stats')
        if (!cancelled) setStats(data as Stats)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load email stats')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [token, navigate, reloadKey])

  const t = stats?.totals
  const cards = [
    { label: 'Sent', value: t?.sent ?? 0, icon: <Send size={18} /> },
    { label: 'Delivered', value: t?.delivered ?? 0, icon: <MailCheck size={18} /> },
    { label: 'Opened', value: t?.opened ?? 0, hint: stats ? `${pct(stats.openRate)} open rate` : undefined, icon: <Eye size={18} /> },
    { label: 'Clicked', value: t?.clicked ?? 0, hint: stats ? `${pct(stats.clickRate)} click rate` : undefined, icon: <MousePointerClick size={18} /> },
    { label: 'Bounced', value: t?.bounced ?? 0, icon: <MailWarning size={18} /> },
  ]

  return (
    <div className={styles.dashShell}>
      <AdminNav />

      <header className={styles.dashHeader} style={{ marginTop: 28 }}>
        <div>
          <h1 className={styles.dashTitle}>Email stats</h1>
          <p className={styles.dashSub}>
            Delivery, open, and click activity from Resend webhooks. Opens are approximate
            (Apple Mail inflates them, image-blockers undercount); clicks are the reliable signal.
          </p>
        </div>
        <button
          type="button"
          className={styles.logoutBtn}
          onClick={() => setReloadKey(k => k + 1)}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </header>

      {error && (
        <div className={styles.errorBanner} role="alert" style={{ marginBottom: 16 }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className={styles.sectionSub} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0' }}>
          <Loader2 size={18} className={styles.spin} />
          Loading…
        </div>
      ) : (
        <>
          <div className={styles.kpiGrid}>
            {cards.map(c => (
              <div key={c.label} className={styles.kpiCard}>
                <div className={styles.kpiIcon}>{c.icon}</div>
                <div className={styles.kpiBody}>
                  <span className={styles.kpiLabel}>{c.label}</span>
                  <span className={styles.kpiValue}>{c.value}</span>
                  {c.hint && <span className={styles.kpiHint}>{c.hint}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Recipients</h2>
              <p className={styles.sectionSub}>
                Latest status per recipient. Populated once Resend webhook events arrive.
              </p>
            </div>

            {stats && stats.recipients.length > 0 ? (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Delivered</th>
                      <th>Opened</th>
                      <th>Clicked</th>
                      <th>Last event</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recipients.map((r, i) => (
                      <tr key={`${r.email}-${i}`}>
                        <td>{r.email}</td>
                        <td>{r.subject || '-'}</td>
                        <td>{r.delivered ? '✓' : '-'}</td>
                        <td>{r.opened ? '✓' : '-'}</td>
                        <td>{r.clicked ? '✓' : '-'}</td>
                        <td>{r.lastType} · {formatDate(r.lastAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={styles.sectionSub} style={{ padding: '8px 0' }}>
                No email events yet. Send a marketing blast (with open/click tracking enabled in
                Resend) and add the webhook so events flow in.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

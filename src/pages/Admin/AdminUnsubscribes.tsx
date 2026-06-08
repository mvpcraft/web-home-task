import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2, MailX, RefreshCw } from 'lucide-react'
import AdminNav from './AdminNav'
import { ADMIN_API_BASE, clearAdminSession, getAdminSession } from './adminAuth'
import styles from './Admin.module.css'

interface UnsubRow {
  email: string
  source: string
  createdAt: string
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminUnsubscribes() {
  const navigate = useNavigate()
  // getAdminSession() returns a fresh object each render, so depend on the
  // token string (stable value) to avoid an effect/refetch loop.
  const token = getAdminSession()?.token

  const [rows, setRows] = useState<UnsubRow[] | null>(null)
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
        const res = await fetch(`${ADMIN_API_BASE}/api/admin/unsubscribes`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 401 || res.status === 403) {
          clearAdminSession()
          navigate('/admin/login', { replace: true })
          return
        }
        const data = await res.json()
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || 'Failed to load unsubscribes')
        }
        if (!cancelled) setRows(data.unsubscribes || [])
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load unsubscribes')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [token, navigate, reloadKey])

  return (
    <div className={styles.dashShell}>
      <AdminNav />

      <header className={styles.dashHeader} style={{ marginTop: 28 }}>
        <div>
          <h1 className={styles.dashTitle}>Unsubscribes</h1>
          <p className={styles.dashSub}>
            Addresses that opted out via the unsubscribe link in a marketing email. These are
            skipped automatically on every marketing blast.
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

      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MailX size={20} color="#FF4D5E" />
            Opted out
            {rows && <span className={styles.sectionSub}>&nbsp;· {rows.length} total</span>}
          </h2>
        </div>

        {loading ? (
          <div className={styles.sectionSub} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0' }}>
            <Loader2 size={18} className={styles.spin} />
            Loading…
          </div>
        ) : rows && rows.length > 0 ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Unsubscribed</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={`${r.email}-${i}`}>
                    <td>{r.email}</td>
                    <td>{r.source}</td>
                    <td>{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={styles.sectionSub} style={{ padding: '8px 0' }}>
            No unsubscribes yet.
          </p>
        )}
      </div>
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Activity, Users, Clock, AlertCircle, Loader2, RefreshCw,
  TrendingDown,
} from 'lucide-react'
import AdminNav from './AdminNav'
import {
  ADMIN_API_BASE,
  clearAdminSession,
  getAdminSession,
} from './adminAuth'
import styles from './Admin.module.css'

interface Overview {
  totalEvents: number
  uniqueVisitors: number
  events24h: number
  events7d: number
}

interface EventCountRow {
  eventName: string
  count: number
  uniqueVisitors: number
}

interface FunnelStep {
  key: string
  label: string
  visitors: number
  conversionFromPrev: number
  conversionFromTop: number
}

interface RecentEventRow {
  id: string
  eventName: string
  path: string | null
  properties: Record<string, unknown>
  anonymousId: string
  userId: string | null
  utmSource: string | null
  ip: string | null
  userAgent: string | null
  referrer: string | null
  createdAt: string
}

interface AnalyticsResponse {
  success: true
  overview: Overview
  byEvent: EventCountRow[]
  funnel: FunnelStep[]
  recent: RecentEventRow[]
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

function formatPercent(n: number): string {
  return `${(n * 100).toFixed(1)}%`
}

function formatRelativeTime(s: string): string {
  const then = new Date(s).getTime()
  if (Number.isNaN(then)) return s
  const diff = Date.now() - then
  if (diff < 60_000) return 'just now'
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// Map raw event names to readable labels for the per-event table. The funnel
// already carries its own labels server-side.
const EVENT_LABEL: Record<string, string> = {
  page_view: 'Page view',
  signup_completed: 'Signup completed',
  ios_download_clicked: 'iOS download clicked',
  android_clicked_coming_soon: 'Android (coming soon) clicked',
  live_match_understood: 'Live-match checkbox toggled',
  live_match_continued: 'Live-match continue clicked',
  marketing_cta_clicked: 'Marketing CTA clicked',
}

function eventLabel(name: string): string {
  return EVENT_LABEL[name] ?? name
}

export default function AdminAnalytics() {
  const navigate = useNavigate()

  const [data, setData] = useState<AnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(
    async (showSpinner = true) => {
      const session = getAdminSession()
      if (!session) {
        navigate('/admin/login', { replace: true })
        return
      }
      if (showSpinner) setLoading(true)
      setRefreshing(true)
      setError(null)
      try {
        const res = await fetch(`${ADMIN_API_BASE}/api/admin/analytics`, {
          headers: { Authorization: `Bearer ${session.token}` },
        })
        if (res.status === 401 || res.status === 403) {
          clearAdminSession()
          navigate('/admin/login', { replace: true })
          return
        }
        const body = await res.json()
        if (!res.ok || !body?.success) {
          throw new Error(body?.message || 'Failed to load analytics')
        }
        setData(body as AnalyticsResponse)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics')
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [navigate],
  )

  useEffect(() => {
    void fetchAnalytics(true)
  }, [fetchAnalytics])

  if (loading) {
    return (
      <div className={styles.dashShell}>
        <AdminNav />
        <div className={styles.loadingScreen}>
          <Loader2 size={32} className={styles.spin} />
          <span>Loading analytics…</span>
        </div>
      </div>
    )
  }

  // Max funnel width is driven by the first (top) step so every bar is
  // measured relative to the same base. Defaults to 1 so we don't divide
  // by zero when there are no events yet.
  const funnelTop = data?.funnel[0]?.visitors ?? 1
  const safeTop = funnelTop > 0 ? funnelTop : 1

  return (
    <div className={styles.dashShell}>
      <AdminNav />

      <header className={styles.dashHeader} style={{ marginTop: 28 }}>
        <div>
          <h1 className={styles.dashTitle}>Onboarding analytics</h1>
          <p className={styles.dashSub}>
            Self-hosted event tracking. No third-party SDK - events post
            straight to <code>/api/analytics/track</code> and are stored in
            the <code>AnalyticsEvent</code> collection.
          </p>
        </div>
        <div className={styles.dashActions}>
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={() => fetchAnalytics(false)}
            disabled={refreshing}
            aria-busy={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? styles.spin : undefined} />
            Refresh
          </button>
        </div>
      </header>

      {error && (
        <div className={styles.errorBanner} role="alert" style={{ marginBottom: 16 }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {data && (
        <>
          {/* Overview KPI cards */}
          <section className={styles.kpiGrid}>
            <KpiCard
              icon={<Activity size={18} />}
              label="Total events"
              value={formatNumber(data.overview.totalEvents)}
              hint="all time"
            />
            <KpiCard
              icon={<Users size={18} />}
              label="Unique visitors"
              value={formatNumber(data.overview.uniqueVisitors)}
              hint="distinct anonymous ids"
            />
            <KpiCard
              icon={<Clock size={18} />}
              label="Events (24h)"
              value={formatNumber(data.overview.events24h)}
              hint={`${formatNumber(data.overview.events7d)} in 7d`}
            />
            <KpiCard
              icon={<TrendingDown size={18} />}
              label="Funnel drop"
              value={
                data.funnel.length > 0
                  ? formatPercent(
                      data.funnel[data.funnel.length - 1].conversionFromTop,
                    )
                  : '—'
              }
              hint="visit /join → click iOS"
            />
          </section>

          {/* Funnel */}
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Onboarding funnel</h2>
              <p className={styles.sectionSub}>
                Unique visitors that reached each step. The first column shows
                drop-off from the previous step; the second shows share of the
                top of the funnel.
              </p>
            </div>

            {data.funnel.every(s => s.visitors === 0) ? (
              <div className={styles.empty}>
                No tracked events yet. Visit <code>/join</code> in another
                browser to generate some data.
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Step</th>
                      <th className={styles.numCol}>Visitors</th>
                      <th className={styles.barCol}>Reach</th>
                      <th className={styles.numCol}>vs. previous</th>
                      <th className={styles.numCol}>vs. top</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.funnel.map((step, i) => (
                      <tr key={step.key}>
                        <td>
                          <strong style={{ color: '#fff' }}>
                            {i + 1}. {step.label}
                          </strong>
                        </td>
                        <td className={styles.numCol}>
                          {formatNumber(step.visitors)}
                        </td>
                        <td className={styles.barCol}>
                          <div className={styles.barTrack}>
                            <div
                              className={styles.barFill}
                              style={{
                                width: `${Math.max(2, (step.visitors / safeTop) * 100)}%`,
                              }}
                            />
                          </div>
                        </td>
                        <td className={styles.numCol}>
                          {i === 0 ? '—' : formatPercent(step.conversionFromPrev)}
                        </td>
                        <td className={styles.numCol}>
                          {formatPercent(step.conversionFromTop)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Events by name */}
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Events by name</h2>
              <p className={styles.sectionSub}>
                Total firings + the number of unique visitors who triggered each.
              </p>
            </div>

            {data.byEvent.length === 0 ? (
              <div className={styles.empty}>No events recorded yet.</div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th className={styles.numCol}>Count</th>
                      <th className={styles.numCol}>Unique visitors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.byEvent.map(row => (
                      <tr key={row.eventName}>
                        <td>
                          <div className={styles.userName}>
                            {eventLabel(row.eventName)}
                          </div>
                          <div className={styles.userEmail}>{row.eventName}</div>
                        </td>
                        <td className={styles.numCol}>{formatNumber(row.count)}</td>
                        <td className={styles.numCol}>
                          {formatNumber(row.uniqueVisitors)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Recent events */}
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Recent events</h2>
              <p className={styles.sectionSub}>
                The latest 100 events, newest first. Hover a long string to see
                the full value.
              </p>
            </div>

            {data.recent.length === 0 ? (
              <div className={styles.empty}>No events recorded yet.</div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>When</th>
                      <th>Event</th>
                      <th>Path</th>
                      <th>Visitor</th>
                      <th>UTM</th>
                      <th>IP</th>
                      <th>Properties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent.map(row => (
                      <tr key={row.id}>
                        <td title={row.createdAt} style={{ whiteSpace: 'nowrap' }}>
                          {formatRelativeTime(row.createdAt)}
                        </td>
                        <td>
                          <span className={styles.sourcePill}>{row.eventName}</span>
                        </td>
                        <td style={{ fontFamily: "'SFMono-Regular', Menlo, monospace", fontSize: 12 }}>
                          {row.path || '—'}
                        </td>
                        <td title={row.anonymousId}>
                          {row.userId ? (
                            <div>
                              <div className={styles.userName} style={{ fontSize: 12 }}>
                                user {row.userId.slice(-6)}
                              </div>
                              <div className={styles.userEmail}>
                                anon {row.anonymousId.slice(0, 8)}
                              </div>
                            </div>
                          ) : (
                            <span className={styles.userEmail}>
                              anon {row.anonymousId.slice(0, 8)}
                            </span>
                          )}
                        </td>
                        <td>
                          {row.utmSource ? (
                            <span className={styles.sourcePill}>{row.utmSource}</span>
                          ) : (
                            <span className={styles.userEmail}>organic</span>
                          )}
                        </td>
                        <td style={{ fontFamily: "'SFMono-Regular', Menlo, monospace", fontSize: 12 }}>
                          {row.ip || '—'}
                        </td>
                        <td>
                          {Object.keys(row.properties).length > 0 ? (
                            <code
                              style={{
                                fontSize: 11,
                                color: '#b0b7d6',
                                background: 'rgba(255,255,255,0.04)',
                                padding: '2px 6px',
                                borderRadius: 4,
                              }}
                              title={JSON.stringify(row.properties)}
                            >
                              {JSON.stringify(row.properties).slice(0, 50)}
                            </code>
                          ) : (
                            <span className={styles.userEmail}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

function KpiCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint: string
}) {
  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiIcon}>{icon}</div>
      <div className={styles.kpiBody}>
        <div className={styles.kpiLabel}>{label}</div>
        <div className={styles.kpiValue}>{value}</div>
        <div className={styles.kpiHint}>{hint}</div>
      </div>
    </div>
  )
}

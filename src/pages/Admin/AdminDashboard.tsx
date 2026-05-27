import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, Users, UserPlus, CreditCard, Repeat,
  Coins, ShoppingBag, AlertCircle, Loader2,
} from 'lucide-react'
import AdminNav from './AdminNav'
import {
  ADMIN_API_BASE,
  clearAdminSession,
  getAdminSession,
} from './adminAuth'
import styles from './Admin.module.css'

interface Overview {
  totalUsers: number
  newUsersToday: number
  newUsers7d: number
  newUsers30d: number
  payingUsers: number
  repeatBuyers: number
  totalCreditsSold: number
  totalPurchaseTxns: number
}

interface UtmSourceRow {
  source: string
  signups: number
  payingUsers: number
  conversionRate: number
}

interface PayingUserRow {
  userId: string
  username: string | null
  email: string | null
  avatar: string | null
  utmSource: string | null
  signupAt: string | null
  purchases: number
  creditsTotal: number
  firstPurchaseAt: string
  lastPurchaseAt: string
  isRepeatBuyer: boolean
}

interface StatsResponse {
  success: true
  overview: Overview
  utmBreakdown: UtmSourceRow[]
  payingUsers: PayingUserRow[]
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

function formatPercent(n: number): string {
  return `${(n * 100).toFixed(1)}%`
}

function formatDate(s: string | null): string {
  if (!s) return '-'
  try {
    return new Date(s).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return '-'
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const session = getAdminSession()

  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'repeat' | 'first'>('all')

  const fetchStats = useCallback(
    async (showSpinner = true) => {
      if (!session) {
        navigate('/admin/login', { replace: true })
        return
      }
      if (showSpinner) setLoading(true)
      setRefreshing(true)
      setError(null)
      try {
        const res = await fetch(`${ADMIN_API_BASE}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${session.token}` },
        })
        if (res.status === 401 || res.status === 403) {
          // Token expired or admin access revoked - boot back to login.
          clearAdminSession()
          navigate('/admin/login', { replace: true })
          return
        }
        const data = await res.json()
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || 'Failed to load stats')
        }
        setStats(data as StatsResponse)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats')
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    // session is read fresh from localStorage on each call; intentionally not
    // tracking it as a dep to avoid re-fetch loops on storage changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate],
  )

  useEffect(() => {
    void fetchStats(true)
  }, [fetchStats])

  const filteredBuyers = (stats?.payingUsers ?? []).filter(u => {
    if (filter === 'repeat') return u.isRepeatBuyer
    if (filter === 'first') return !u.isRepeatBuyer
    return true
  })

  // Max signups in UTM breakdown - used to scale the inline bars.
  const maxUtmSignups = stats
    ? Math.max(1, ...stats.utmBreakdown.map(r => r.signups))
    : 1

  if (loading) {
    return (
      <div className={styles.dashShell}>
        <div className={styles.loadingScreen}>
          <Loader2 size={32} className={styles.spin} />
          <span>Loading dashboard…</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.dashShell}>
      <AdminNav />

      <header className={styles.dashHeader} style={{ marginTop: 28 }}>
        <div>
          <h1 className={styles.dashTitle}>Dashboard</h1>
          <p className={styles.dashSub}>
            Signups, conversion, and paying users. Admin accounts are excluded.
          </p>
        </div>
        <div className={styles.dashActions}>
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={() => fetchStats(false)}
            disabled={refreshing}
            aria-busy={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? styles.spin : undefined} />
            Refresh
          </button>
        </div>
      </header>

      {error && (
        <div className={styles.errorBanner} role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {stats && (
        <>
          {/* KPI cards */}
          <section className={styles.kpiGrid}>
            <KpiCard
              icon={<Users size={18} />}
              label="Total users"
              value={formatNumber(stats.overview.totalUsers)}
              hint={`${formatNumber(stats.overview.newUsersToday)} today`}
            />
            <KpiCard
              icon={<UserPlus size={18} />}
              label="New users (7d)"
              value={formatNumber(stats.overview.newUsers7d)}
              hint={`${formatNumber(stats.overview.newUsers30d)} in 30d`}
            />
            <KpiCard
              icon={<CreditCard size={18} />}
              label="Paying users"
              value={formatNumber(stats.overview.payingUsers)}
              hint={
                stats.overview.totalUsers > 0
                  ? `${formatPercent(stats.overview.payingUsers / stats.overview.totalUsers)} conversion`
                  : '-'
              }
            />
            <KpiCard
              icon={<Repeat size={18} />}
              label="Repeat buyers"
              value={formatNumber(stats.overview.repeatBuyers)}
              hint={
                stats.overview.payingUsers > 0
                  ? `${formatPercent(stats.overview.repeatBuyers / stats.overview.payingUsers)} of payers`
                  : '-'
              }
            />
            <KpiCard
              icon={<Coins size={18} />}
              label="Credits sold"
              value={formatNumber(stats.overview.totalCreditsSold)}
              hint="all-time"
            />
            <KpiCard
              icon={<ShoppingBag size={18} />}
              label="Purchase txns"
              value={formatNumber(stats.overview.totalPurchaseTxns)}
              hint="all-time"
            />
          </section>

          {/* UTM source breakdown */}
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Signups by marketing source</h2>
              <p className={styles.sectionSub}>
                Where users came from. <code>organic</code> = no <code>utm_source</code> on signup.
              </p>
            </div>

            {stats.utmBreakdown.length === 0 ? (
              <div className={styles.empty}>No signups recorded yet.</div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Source</th>
                      <th className={styles.numCol}>Signups</th>
                      <th className={styles.barCol}>Share</th>
                      <th className={styles.numCol}>Paying</th>
                      <th className={styles.numCol}>Conversion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.utmBreakdown.map(row => (
                      <tr key={row.source}>
                        <td>
                          <span className={styles.sourcePill}>{row.source}</span>
                        </td>
                        <td className={styles.numCol}>{formatNumber(row.signups)}</td>
                        <td className={styles.barCol}>
                          <div className={styles.barTrack}>
                            <div
                              className={styles.barFill}
                              style={{
                                width: `${Math.max(2, (row.signups / maxUtmSignups) * 100)}%`,
                              }}
                            />
                          </div>
                        </td>
                        <td className={styles.numCol}>{formatNumber(row.payingUsers)}</td>
                        <td className={styles.numCol}>{formatPercent(row.conversionRate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Paying users */}
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Paying users</h2>
              <p className={styles.sectionSub}>
                Sorted by total credits purchased. Use the filter to split
                first-time buyers from repeat purchasers.
              </p>
            </div>

            <div className={styles.filterRow}>
              <FilterTab active={filter === 'all'} onClick={() => setFilter('all')}>
                All ({formatNumber(stats.payingUsers.length)})
              </FilterTab>
              <FilterTab active={filter === 'first'} onClick={() => setFilter('first')}>
                First-time only (
                {formatNumber(stats.payingUsers.filter(u => !u.isRepeatBuyer).length)})
              </FilterTab>
              <FilterTab active={filter === 'repeat'} onClick={() => setFilter('repeat')}>
                Repeat buyers ({formatNumber(stats.overview.repeatBuyers)})
              </FilterTab>
            </div>

            {filteredBuyers.length === 0 ? (
              <div className={styles.empty}>No users match this filter yet.</div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Source</th>
                      <th className={styles.numCol}>Purchases</th>
                      <th className={styles.numCol}>Credits</th>
                      <th>First purchase</th>
                      <th>Last purchase</th>
                      <th>Signed up</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBuyers.map(u => (
                      <tr key={u.userId}>
                        <td>
                          <div className={styles.userCell}>
                            <span className={styles.userAvatar}>{u.avatar || '⭐'}</span>
                            <div>
                              <div className={styles.userName}>
                                {u.username || '(deleted)'}
                                {u.isRepeatBuyer && (
                                  <span className={styles.repeatBadge}>Repeat</span>
                                )}
                              </div>
                              <div className={styles.userEmail}>{u.email || '-'}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={styles.sourcePill}>{u.utmSource || 'organic'}</span>
                        </td>
                        <td className={styles.numCol}>{formatNumber(u.purchases)}</td>
                        <td className={styles.numCol}>{formatNumber(u.creditsTotal)}</td>
                        <td>{formatDate(u.firstPurchaseAt)}</td>
                        <td>{formatDate(u.lastPurchaseAt)}</td>
                        <td>{formatDate(u.signupAt)}</td>
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

function FilterTab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      className={`${styles.filterTab} ${active ? styles.filterTabActive : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

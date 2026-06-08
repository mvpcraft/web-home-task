/**
 * Tiny in-house analytics client. Posts whitelisted events to the backend's
 * /api/analytics/track endpoint. No third-party SDKs, no cookies beyond
 * localStorage (for the persistent anonymous id) and sessionStorage (for the
 * per-tab session id).
 *
 * Design notes:
 *  - All sends are fire-and-forget. We use `navigator.sendBeacon` when
 *    available so events fire reliably during page transitions (without
 *    blocking the unload).
 *  - Anonymous id is generated on first call and persists across visits in
 *    localStorage, so a user's pre-signup and post-signup events can be
 *    tied together server-side.
 *  - User id is set by the auth flow after a successful signup/login (via
 *    `setAnalyticsUserId`) and cleared on logout (via `clearAnalyticsUserId`).
 *  - utm_source is auto-read from the current URL on every call so any event
 *    arriving from a tagged marketing link carries the source.
 */

const ANON_KEY = 'pbp.analytics.anonId'
const USER_KEY = 'pbp.analytics.userId'

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || ''

// Keep this in lock-step with ALLOWED_EVENT_NAMES on the backend. Adding an
// event here without adding it on the server will result in a silent 400.
export type AnalyticsEvent =
  | 'page_view'
  | 'signup_completed'
  | 'ios_download_clicked'
  | 'android_download_clicked'
  | 'android_clicked_coming_soon'
  | 'live_match_understood'
  | 'live_match_continued'
  | 'marketing_cta_clicked'

function generateId(): string {
  // crypto.randomUUID is available in all modern browsers; fall back to a
  // Math.random-based id so legacy browsers don't break onboarding.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  )
}

function safeStorage<T extends Storage>(get: () => T | undefined): T | null {
  // Private-mode Safari throws on `localStorage.setItem`. Wrap accesses so a
  // throw doesn't take down the whole onboarding flow.
  try {
    const s = get()
    if (!s) return null
    const probe = '__pbp_probe__'
    s.setItem(probe, '1')
    s.removeItem(probe)
    return s
  } catch {
    return null
  }
}

function getAnonymousId(): string {
  const storage = safeStorage(() => (typeof window !== 'undefined' ? window.localStorage : undefined))
  if (!storage) {
    // No persistent storage available - fall back to a per-tab id so the
    // session is still internally consistent.
    let inMemory = (window as unknown as { __pbpAnonId?: string }).__pbpAnonId
    if (!inMemory) {
      inMemory = generateId()
      ;(window as unknown as { __pbpAnonId?: string }).__pbpAnonId = inMemory
    }
    return inMemory
  }
  let id = storage.getItem(ANON_KEY)
  if (!id) {
    id = generateId()
    storage.setItem(ANON_KEY, id)
  }
  return id
}

function getUserId(): string | null {
  const storage = safeStorage(() => (typeof window !== 'undefined' ? window.localStorage : undefined))
  if (!storage) return null
  return storage.getItem(USER_KEY)
}

export function setAnalyticsUserId(id: string): void {
  const storage = safeStorage(() => (typeof window !== 'undefined' ? window.localStorage : undefined))
  if (!storage) return
  storage.setItem(USER_KEY, id)
}

export function clearAnalyticsUserId(): void {
  const storage = safeStorage(() => (typeof window !== 'undefined' ? window.localStorage : undefined))
  if (!storage) return
  storage.removeItem(USER_KEY)
}

/**
 * Send an event. Fire-and-forget - the network call never blocks the UI.
 *
 * We use `fetch({ keepalive: true })` rather than `navigator.sendBeacon`
 * because:
 *  - sendBeacon with `application/json` triggers a CORS preflight; if the
 *    preflight fails the beacon is dropped SILENTLY (no network entry in
 *    DevTools, no console error). That's the worst possible failure mode
 *    for debugging analytics.
 *  - `fetch keepalive` survives page navigation/unload the same way and
 *    shows up cleanly in the Network panel so we can see 4xx/5xx.
 *
 * Errors are logged to console (not thrown) so you can spot misconfigured
 * env vars or missing routes without breaking the onboarding flow.
 */
export function track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  const payload = {
    eventName: event,
    path: url.pathname,
    properties: properties ?? {},
    anonymousId: getAnonymousId(),
    userId: getUserId(),
    utmSource: url.searchParams.get('utm_source') || null,
    referrer: document.referrer || null,
  }

  // Path is `/collect` (not `/track`) because most default ad-blocker
  // filter lists (uBlock, AdGuard, Brave shields, PiHole) match `*track*`
  // and silently drop the request. The backend still accepts `/track` as
  // a backwards-compat alias for now.
  const endpoint = `${API_BASE}/api/analytics/collect`

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
    // Explicit so misconfigured CORS surfaces as a clear browser error
    // instead of an opaque no-cors response with status 0.
    mode: 'cors',
    credentials: 'omit',
  })
    .then(res => {
      if (!res.ok) {
        // 404 here almost always means the backend hasn't been redeployed
        // with the new /api/analytics/track route. 401/403 means an auth
        // middleware was accidentally placed in front of the public route.
        console.warn(
          `[analytics] track(${event}) failed: ${res.status} ${res.statusText} - ` +
            `endpoint=${endpoint}. ` +
            'If this is 404, the backend likely needs a redeploy.',
        )
      }
    })
    .catch(err => {
      // Network-level failure: bad VITE_API_URL, CORS, DNS, offline. The
      // console message tells you which knob to check.
      console.warn(
        `[analytics] track(${event}) network error against ${endpoint}:`,
        err instanceof Error ? err.message : err,
      )
    })
}

/**
 * Shortcut for the common case. Includes the page path automatically; pass
 * extra context via `extra` if you want to discriminate between, e.g., the
 * hero CTA and the bottom CTA on the same page.
 */
export function trackPageView(extra?: Record<string, unknown>): void {
  track('page_view', extra)
}

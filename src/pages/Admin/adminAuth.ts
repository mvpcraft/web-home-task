/**
 * Tiny admin-auth helper. The web app has no general user session, so we don't
 * need a full context - admin pages just read/write a JWT + identity from
 * localStorage and the dashboard fetches with `Authorization: Bearer <token>`.
 *
 * Stored together so a partial state (token without user, etc.) can't happen.
 */

const STORAGE_KEY = 'pbp.admin.session'

export interface AdminUser {
  id: string
  username: string
  email: string
  avatar?: string
  role: 'admin'
}

export interface AdminSession {
  token: string
  user: AdminUser
}

export function getAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AdminSession
    if (!parsed.token || parsed.user?.role !== 'admin') {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function setAdminSession(session: AdminSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearAdminSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export const ADMIN_API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || ''

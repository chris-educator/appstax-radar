import { ADMIN_KEY_STORAGE } from '../constants/branding'

export type RadarItem = {
  id: string
  source_id: string
  source_name: string
  title: string
  url: string
  published_at: string | null
  raw_snippet: string
  summary: string
  category: string
  relevance_score: number | null
  status: 'pending' | 'published' | 'rejected'
  created_at: string
}

export function getAdminKey(): string {
  try {
    return sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? ''
  } catch {
    return ''
  }
}

export function setAdminKey(key: string) {
  try {
    sessionStorage.setItem(ADMIN_KEY_STORAGE, key)
  } catch {
    /* ignore */
  }
}

function adminHeaders(): HeadersInit {
  const key = getAdminKey()
  return key ? { 'X-Radar-Admin-Key': key } : {}
}

export async function fetchHealth() {
  const res = await fetch('/api/health')
  if (!res.ok) throw new Error('Health check failed')
  return res.json()
}

export async function fetchItems(params: {
  status?: string
  category?: string
  limit?: number
  offset?: number
}) {
  const q = new URLSearchParams()
  if (params.status) q.set('status', params.status)
  if (params.category) q.set('category', params.category)
  if (params.limit) q.set('limit', String(params.limit))
  if (params.offset) q.set('offset', String(params.offset))
  const res = await fetch(`/api/items?${q}`)
  if (!res.ok) throw new Error('Failed to load items')
  return res.json() as Promise<{ items: RadarItem[]; total: number }>
}

export async function approveItem(id: string) {
  const res = await fetch(`/api/items/${id}/approve`, {
    method: 'POST',
    headers: adminHeaders(),
  })
  if (!res.ok) throw new Error('Approve failed')
  return res.json()
}

export async function rejectItem(id: string) {
  const res = await fetch(`/api/items/${id}/reject`, {
    method: 'POST',
    headers: adminHeaders(),
  })
  if (!res.ok) throw new Error('Reject failed')
  return res.json()
}

export async function runScout() {
  const res = await fetch('/api/scout/run', {
    method: 'POST',
    headers: { ...adminHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ summarize: true }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.detail ?? 'Scout run failed')
  }
  return res.json()
}

export async function fetchScoutStatus() {
  const res = await fetch('/api/scout/status')
  if (!res.ok) throw new Error('Scout status failed')
  return res.json()
}

import { useCallback, useEffect, useState } from 'react'
import {
  approveItem,
  fetchItems,
  fetchScoutStatus,
  getAdminKey,
  rejectItem,
  runScout,
  setAdminKey,
  type RadarItem,
} from '../api/client'
import { StoryCard } from '../components/StoryCard'

export function ReviewPage() {
  const [keyInput, setKeyInput] = useState('')
  const [unlocked, setUnlocked] = useState(() => !!getAdminKey())
  const [items, setItems] = useState<RadarItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [scoutBusy, setScoutBusy] = useState(false)
  const [scoutMsg, setScoutMsg] = useState('')
  const [pendingCount, setPendingCount] = useState(0)

  const load = useCallback(async () => {
    if (!unlocked) return
    setLoading(true)
    setError('')
    try {
      const [queue, status] = await Promise.all([
        fetchItems({ status: 'pending', limit: 50 }),
        fetchScoutStatus(),
      ])
      setItems(queue.items)
      setPendingCount(status.pending_count ?? queue.total)
    } catch {
      setError('Review queue unavailable — check your admin key.')
    } finally {
      setLoading(false)
    }
  }, [unlocked])

  useEffect(() => {
    if (unlocked) load()
  }, [unlocked, load])

  function saveKey() {
    setAdminKey(keyInput)
    setUnlocked(true)
  }

  async function handleScout() {
    setScoutBusy(true)
    setScoutMsg('')
    setError('')
    try {
      const result = await runScout()
      setScoutMsg(
        `Scout done — ${result.new_count} new, ${result.summarized_count} summarized, ${result.fetched_count} fetched.`,
      )
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Scout failed')
    } finally {
      setScoutBusy(false)
    }
  }

  async function handleApprove(id: string) {
    await approveItem(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
    setPendingCount((n) => Math.max(0, n - 1))
  }

  async function handleReject(id: string) {
    await rejectItem(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
    setPendingCount((n) => Math.max(0, n - 1))
  }

  if (!unlocked) {
    return (
      <div className="card page--narrow">
        <h2 className="card__title">Review queue</h2>
        <p className="hint">Enter your RADAR_ADMIN_SECRET to approve or reject Scout items.</p>
        <label className="field">
          <span>Admin key</span>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            autoComplete="off"
          />
        </label>
        <button type="button" className="btn btn--primary" onClick={saveKey} disabled={!keyInput}>
          Unlock review
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="review-toolbar">
        <p className="hint" style={{ margin: 0 }}>
          {pendingCount} pending · session key stored until tab closes
        </p>
        <button type="button" className="btn btn--primary" onClick={handleScout} disabled={scoutBusy}>
          {scoutBusy ? 'Scout running…' : 'Run Scout'}
        </button>
      </div>
      {scoutMsg ? <p className="hint">{scoutMsg}</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {loading ? <p className="hint">Loading queue…</p> : null}

      <div className="story-list">
        {items.map((item) => (
          <div key={item.id} className="review-item">
            <StoryCard item={item} showScore />
            <div className="review-item__actions">
              <button type="button" className="btn btn--primary" onClick={() => handleApprove(item.id)}>
                Publish
              </button>
              <button type="button" className="btn" onClick={() => handleReject(item.id)}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && items.length === 0 ? (
        <div className="card">
          <p className="hero__lead" style={{ margin: 0 }}>
            Queue empty. Run Scout to fetch from 15 sources.
          </p>
        </div>
      ) : null}
    </div>
  )
}

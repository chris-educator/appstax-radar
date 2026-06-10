import { useCallback, useEffect, useState } from 'react'
import { fetchItems, type RadarItem } from '../api/client'
import { CATEGORIES } from '../constants/categories'
import { StoryCard } from '../components/StoryCard'

export function FeedPage() {
  const [category, setCategory] = useState('')
  const [items, setItems] = useState<RadarItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchItems({
        status: 'published',
        category: category || undefined,
        limit: 40,
      })
      setItems(data.items)
    } catch {
      setError('Could not load the feed. Is the API running?')
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div>
      <div className="feed-filters" role="group" aria-label="Category">
        {CATEGORIES.map((c) => (
          <button
            key={c.id || 'all'}
            type="button"
            className={category === c.id ? 'filter-chip is-active' : 'filter-chip'}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? <p className="hint">Loading feed…</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error && items.length === 0 ? (
        <div className="card">
          <p className="hero__lead" style={{ margin: 0 }}>
            No published stories yet. Open <strong>Review</strong>, run Scout, and approve items to
            populate the feed.
          </p>
        </div>
      ) : null}

      <div className="story-list">
        {items.map((item) => (
          <StoryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

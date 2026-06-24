import { useCallback, useEffect, useState } from 'react'
import { fetchFeedMeta, fetchItems, type FeedMeta, type RadarItem, type SortMode } from '../api/client'
import { FeedHero } from '../components/FeedHero'
import { FeedToolbar } from '../components/FeedToolbar'
import { StoryCard } from '../components/StoryCard'

export function FeedPage() {
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState<SortMode>('popularity')
  const [items, setItems] = useState<RadarItem[]>([])
  const [total, setTotal] = useState(0)
  const [meta, setMeta] = useState<FeedMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [data, feedMeta] = await Promise.all([
        fetchItems({
          status: 'published',
          category: category || undefined,
          sort,
          limit: 50,
        }),
        fetchFeedMeta().catch(() => null),
      ])
      setItems(data.items)
      setTotal(data.total)
      if (feedMeta) setMeta(feedMeta)
    } catch {
      setError('Could not load the feed. Is the API running?')
    } finally {
      setLoading(false)
    }
  }, [category, sort])

  useEffect(() => {
    load()
  }, [load])

  const [featured, ...rest] = items

  return (
    <div className="feed-page">
      <FeedHero meta={meta} total={total} />
      <FeedToolbar
        category={category}
        sort={sort}
        loading={loading}
        onCategoryChange={setCategory}
        onSortChange={setSort}
        onRefresh={load}
      />

      {loading && items.length === 0 ? <p className="hint feed-status">Scanning the AI horizon…</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error && items.length === 0 ? (
        <div className="feed-empty card">
          <h2 className="feed-empty__title">Feed warming up</h2>
          <p className="feed-empty__text">
            Scout pulls from 20 AI sources on a schedule. If you are the admin, open{' '}
            <a href="/review">Review</a> and run Scout — high-relevance stories auto-publish.
          </p>
        </div>
      ) : null}

      {featured && sort === 'popularity' && !category ? (
        <StoryCard item={featured} featured rank={1} />
      ) : null}

      <div className="story-list">
        {(sort === 'popularity' && !category && featured ? rest : items).map((item, i) => (
          <StoryCard
            key={item.id}
            item={item}
            rank={sort === 'popularity' ? i + (featured && !category ? 2 : 1) : undefined}
          />
        ))}
      </div>

      <p className="feed-attribution">
        Headlines and thumbnails belong to their original publishers. AppStax Radar provides original
        summaries and links out — always read the source for the full story.
      </p>
    </div>
  )
}

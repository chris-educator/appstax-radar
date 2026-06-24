import type { FeedMeta } from '../api/client'
import { timeAgo } from '../utils/timeAgo'

type FeedHeroProps = {
  meta: FeedMeta | null
  total: number
}

export function FeedHero({ meta, total }: FeedHeroProps) {
  const lastRun = meta?.last_scout?.finished_at ?? meta?.last_scout?.started_at
  const updated = lastRun ? timeAgo(lastRun) : null

  return (
    <section className="feed-hero" aria-label="Feed overview">
      <div className="feed-hero__glow" aria-hidden />
      <div className="feed-hero__inner">
        <div className="feed-hero__badge">
          <span className="feed-hero__pulse" aria-hidden />
          Live AI feed
        </div>
        <p className="feed-hero__lead">
          Old-school RSS energy, modern AI coverage — models, agents, research, dev tools, and industry
          moves. Sorted by popularity. Every headline links to the original publisher.
        </p>
        <dl className="feed-hero__stats">
          <div className="feed-hero__stat feed-hero__stat--blue">
            <dt>Stories</dt>
            <dd>{total}</dd>
          </div>
          <div className="feed-hero__stat feed-hero__stat--green">
            <dt>Sources</dt>
            <dd>{meta?.source_count ?? '—'}</dd>
          </div>
          <div className="feed-hero__stat feed-hero__stat--orange">
            <dt>Updated</dt>
            <dd>{updated ?? '—'}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

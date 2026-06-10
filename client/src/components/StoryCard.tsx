import type { RadarItem } from '../api/client'
import { categoryLabel } from '../constants/categories'

function formatWhen(iso: string | null) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return ''
  }
}

type StoryCardProps = {
  item: RadarItem
  showScore?: boolean
}

export function StoryCard({ item, showScore }: StoryCardProps) {
  return (
    <article className="story-card">
      <div className="story-card__meta">
        <span className="story-card__chip">{categoryLabel(item.category)}</span>
        <span className="story-card__source">{item.source_name}</span>
        {item.published_at ? (
          <time className="story-card__date" dateTime={item.published_at}>
            {formatWhen(item.published_at)}
          </time>
        ) : null}
        {showScore && item.relevance_score != null ? (
          <span className="story-card__score">{Math.round(item.relevance_score * 100)}% match</span>
        ) : null}
      </div>
      <h2 className="story-card__title">
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {item.title}
        </a>
      </h2>
      <p className="story-card__summary">{item.summary || item.raw_snippet}</p>
    </article>
  )
}

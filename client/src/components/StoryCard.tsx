import type { CSSProperties } from 'react'
import type { RadarItem } from '../api/client'
import { thumbnailForItem } from '../api/client'
import { categoryLabel } from '../constants/categories'
import { categoryStyle } from '../constants/categoryColors'
import { timeAgo } from '../utils/timeAgo'

type StoryCardProps = {
  item: RadarItem
  showScore?: boolean
  featured?: boolean
  rank?: number
}

function ExternalIcon() {
  return (
    <svg className="story-card__external" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StoryCard({ item, showScore, featured, rank }: StoryCardProps) {
  const colors = categoryStyle(item.category)
  const thumb = thumbnailForItem(item)
  const isHot = (item.popularity_score ?? 0) >= 0.65
  const when = timeAgo(item.published_at ?? item.created_at)

  return (
    <article
      className={`story-card${featured ? ' story-card--featured' : ''}`}
      style={{ '--cat-border': colors.border, '--cat-bg': colors.bg, '--cat-text': colors.text } as CSSProperties}
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="story-card__link"
        aria-label={`Read full article: ${item.title}`}
      >
        {thumb ? (
          <div className="story-card__media">
            <img
              src={thumb}
              alt=""
              loading="lazy"
              decoding="async"
              className="story-card__img"
              onError={(e) => {
                e.currentTarget.parentElement?.classList.add('story-card__media--fallback')
              }}
            />
          </div>
        ) : (
          <div className="story-card__media story-card__media--fallback" aria-hidden>
            <span className="story-card__media-letter">{item.source_name.charAt(0)}</span>
          </div>
        )}

        <div className="story-card__body">
          <div className="story-card__meta">
            {rank != null ? <span className="story-card__rank">#{rank}</span> : null}
            <span className="story-card__chip">{categoryLabel(item.category)}</span>
            {isHot ? <span className="story-card__hot">Hot</span> : null}
            <span className="story-card__source">{item.source_name}</span>
            {when ? (
              <time className="story-card__date" dateTime={item.published_at ?? item.created_at}>
                {when}
              </time>
            ) : null}
            {showScore && item.relevance_score != null ? (
              <span className="story-card__score">{Math.round(item.relevance_score * 100)}% match</span>
            ) : null}
          </div>

          <h2 className="story-card__title">
            {item.title}
            <ExternalIcon />
          </h2>

          <p className="story-card__summary">{item.summary || item.raw_snippet}</p>
        </div>
      </a>
    </article>
  )
}

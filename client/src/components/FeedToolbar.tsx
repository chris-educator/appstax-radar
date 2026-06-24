import type { CSSProperties } from 'react'
import { CATEGORIES } from '../constants/categories'
import { categoryStyle } from '../constants/categoryColors'
import type { SortMode } from '../api/client'

type FeedToolbarProps = {
  category: string
  sort: SortMode
  loading: boolean
  onCategoryChange: (id: string) => void
  onSortChange: (sort: SortMode) => void
  onRefresh: () => void
}

export function FeedToolbar({
  category,
  sort,
  loading,
  onCategoryChange,
  onSortChange,
  onRefresh,
}: FeedToolbarProps) {
  return (
    <div className="feed-toolbar">
      <div className="feed-filters" role="group" aria-label="Category">
        {CATEGORIES.map((c) => {
          const colors = c.id ? categoryStyle(c.id) : null
          const active = category === c.id
          return (
            <button
              key={c.id || 'all'}
              type="button"
              className={active ? 'filter-chip is-active' : 'filter-chip'}
              style={
                active && colors
                  ? ({ '--chip-bg': colors.bg, '--chip-text': colors.text, '--chip-border': colors.border } as CSSProperties)
                  : undefined
              }
              onClick={() => onCategoryChange(c.id)}
            >
              {c.label}
            </button>
          )
        })}
      </div>

      <div className="feed-toolbar__actions">
        <div className="sort-toggle" role="group" aria-label="Sort order">
          <button
            type="button"
            className={sort === 'popularity' ? 'sort-toggle__btn is-active' : 'sort-toggle__btn'}
            onClick={() => onSortChange('popularity')}
          >
            🔥 Hot
          </button>
          <button
            type="button"
            className={sort === 'recent' ? 'sort-toggle__btn is-active' : 'sort-toggle__btn'}
            onClick={() => onSortChange('recent')}
          >
            🕐 Latest
          </button>
        </div>
        <button type="button" className="btn btn--ghost" onClick={onRefresh} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
    </div>
  )
}

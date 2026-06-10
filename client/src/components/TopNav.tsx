import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'top-nav__link is-active' : 'top-nav__link'

export function TopNav() {
  return (
    <nav className="top-nav" aria-label="Primary">
      <NavLink to="/" end className={linkClass}>
        Feed
      </NavLink>
      <NavLink to="/review" className={linkClass}>
        Review
      </NavLink>
    </nav>
  )
}

import type { ReactNode } from 'react'
import { EDSTACK_PROJECTS_URL } from '../constants/branding'
import { Logo } from './Logo'

type SiteTopBarProps = { children: ReactNode }

export function SiteTopBar({ children }: SiteTopBarProps) {
  return (
    <div className="site-top-bar shrink-0">
      <div className="site-top-bar__inner mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        <a
          href={EDSTACK_PROJECTS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="site-top-bar__logo inline-flex w-fit shrink-0"
          aria-label="EdStack"
        >
          <Logo tone="dark" />
        </a>
        <div className="site-top-bar__actions">{children}</div>
      </div>
    </div>
  )
}

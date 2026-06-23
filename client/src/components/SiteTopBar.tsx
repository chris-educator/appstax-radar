import type { ReactNode } from 'react'
import { EDSTACK_TOOLS_URL } from '../constants/branding'
import { EdStackLogo } from './EdStackLogo'

type SiteTopBarProps = {
  children: ReactNode
  innerClassName?: string
}

export function SiteTopBar({
  children,
  innerClassName = 'site-top-bar__inner mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8',
}: SiteTopBarProps) {
  return (
    <div className="site-top-bar shrink-0">
      <div className={innerClassName}>
        <a
          href={EDSTACK_TOOLS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="site-top-bar__logo inline-flex w-fit shrink-0"
          aria-label="EdStack tools"
        >
          <EdStackLogo tone="dark" />
        </a>
        <div className="site-top-bar__actions site-top-bar__tools">{children}</div>
      </div>
    </div>
  )
}

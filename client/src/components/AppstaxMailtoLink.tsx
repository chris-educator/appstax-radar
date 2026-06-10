import type { ReactNode } from 'react'
import { APPSTAX_MAILTO_LINK_PROPS } from '../constants/branding'

type Props = { href: string; className?: string; children: ReactNode }

export function AppstaxMailtoLink({ href, className, children }: Props) {
  return (
    <a href={href} className={className} {...APPSTAX_MAILTO_LINK_PROPS}>
      {children}
    </a>
  )
}

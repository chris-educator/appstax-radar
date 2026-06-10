import type { MouseEvent } from 'react'
import {
  APP_PRIVACY_BLURB,
  appstaxBugReportMailto,
  appstaxCopyrightLine,
} from '../constants/branding'
import { AppstaxMailtoLink } from './AppstaxMailtoLink'

function scrollToTop(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function Footer() {
  return (
    <footer className="mt-auto shrink-0 border-t border-white/6 bg-[#09090b]">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 md:px-8">
        <p className="appstax-footer__line1 text-center text-xs font-medium">
          <a
            href="#top"
            onClick={scrollToTop}
            className="appstax-footer__copyright inline-flex items-center gap-2 text-[#fafafa] transition-colors hover:text-[#22c55e]"
          >
            <span>{appstaxCopyrightLine()} · Powered by Gemini AI</span>
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.85)]"
              aria-hidden
            />
          </a>
          <AppstaxMailtoLink href={appstaxBugReportMailto()} className="appstax-bug-report-link ml-[1ch]">
            Report a Bug
          </AppstaxMailtoLink>
        </p>
        <p className="mx-auto mt-1.5 max-w-2xl text-center text-[11px] leading-relaxed text-[#a1a1aa]">
          {APP_PRIVACY_BLURB}
        </p>
      </div>
    </footer>
  )
}

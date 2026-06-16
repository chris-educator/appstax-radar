import type { MouseEvent, ReactNode } from 'react'
import {
  APP_PRIVACY_BLURB,
  APPSTAX_HOME_URL,
  EDSTACK_PROJECTS_URL,
  appstaxBugReportMailto,
  appstaxCopyrightLine,
} from '../constants/branding'
import { AppstaxMailtoLink } from './AppstaxMailtoLink'
import { EdStackLogo } from './EdStackLogo'
import { Logo } from './Logo'

const EDSTACK_FOOTER_LINKS = [
  { label: 'Why EdStack', href: 'https://edstack.appstax.ai/#why' },
  { label: "Who It's for", href: 'https://edstack.appstax.ai/#audiences' },
  { label: 'The tools', href: 'https://edstack.appstax.ai/#tools' },
] as const

function scrollToTop(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function FooterGreenLight() {
  return (
    <span
      className="h-2 w-2 shrink-0 rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.85)] ring-1 ring-[#22c55e]/40"
      aria-hidden
    />
  )
}

function FooterNavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="site-footer-chrome-link text-center text-sm font-semibold text-[#fafafa] transition-colors hover:text-[#22c55e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22c55e]"
    >
      {label}
    </a>
  )
}

type FooterProps = {
  /** Optional extra line(s) below privacy blurb (app-specific). */
  extra?: ReactNode
}

export function Footer({ extra }: FooterProps) {
  return (
    <footer className="mt-auto shrink-0 border-t border-white/6 bg-[#09090b]">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 md:px-8">
        <nav
          className="site-footer-chrome-row mb-4 grid grid-cols-2 items-center gap-x-4 gap-y-3 sm:grid-cols-4 sm:gap-x-6"
          aria-label="Footer"
        >
          <div className="site-footer-chrome-logos col-span-2 flex flex-wrap items-center justify-center gap-4 sm:col-span-1 sm:justify-start">
            <a
              href={APPSTAX_HOME_URL}
              aria-label="AppStax home"
              className="shrink-0 no-underline"
            >
              <Logo tone="dark" markBottomBar="light" size={24} />
            </a>
            <a
              href={EDSTACK_PROJECTS_URL}
              aria-label="EdStack home"
              className="shrink-0 no-underline"
            >
              <EdStackLogo tone="dark" size={24} />
            </a>
          </div>
          {EDSTACK_FOOTER_LINKS.map(link => (
            <FooterNavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <p className="text-center text-xs font-medium text-[#fafafa]">
          <a
            href="#top"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 transition-colors hover:text-[#22c55e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22c55e]"
          >
            <span>{appstaxCopyrightLine()} · Powered by Gemini AI</span>
            <FooterGreenLight />
          </a>
          <AppstaxMailtoLink
            href={appstaxBugReportMailto()}
            className="appstax-bug-report-link ml-[1ch]"
          >
            Report a Bug
          </AppstaxMailtoLink>
        </p>
        <p className="mx-auto mt-1.5 max-w-2xl text-center text-[11px] leading-relaxed text-[#a1a1aa]">
          {APP_PRIVACY_BLURB}
        </p>
        {extra}
      </div>
    </footer>
  )
}

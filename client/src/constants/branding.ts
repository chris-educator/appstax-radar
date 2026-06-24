export const APPSTAX_HOME_URL = 'https://appstax.ai'

export const EDSTACK_PROJECTS_URL = 'https://edstack.appstax.ai'

/** EdStack landing — tools / apps grid (`#tools`). Top-bar logo link. */
export const EDSTACK_TOOLS_URL = 'https://edstack.appstax.ai/#stack'

export const APP_TITLE = 'AppStax Radar'
export const APP_TITLE_MUTED = 'AppStax '
export const APP_TITLE_ACCENT = 'Radar'

export const APP_TAGLINE =
  'Your one-stop AI news radar — headlines from 20+ sources, ranked by what builders are talking about. Click through for the full story.'

export const APPSTAX_SUPPORT_EMAIL = 'apps@appstax.ai'
export const APP_BUG_REPORT_NAME = 'AppStax Radar'

export const APPSTAX_MAILTO_LINK_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const

export function appstaxMailto(options: { subject?: string; body?: string } = {}) {
  const params: string[] = []
  if (options.subject) params.push(`subject=${encodeURIComponent(options.subject)}`)
  if (options.body) params.push(`body=${encodeURIComponent(options.body)}`)
  const query = params.length ? `?${params.join('&')}` : ''
  return `mailto:${APPSTAX_SUPPORT_EMAIL}${query}`
}

export function appstaxBugReportMailto(appName = APP_BUG_REPORT_NAME) {
  return appstaxMailto({ subject: `Bug report — ${appName}` })
}

export function appstaxCopyrightLine(year = new Date().getFullYear()) {
  return `© ${year} AppStax · Limited only by Imagination · Brisbane · Australia`
}

/** Canonical one-liner — appstax-website/docs/privacy-marketing-blurbs.md § AppStax Radar */
export const APP_PRIVACY_BLURB =
  'Headlines link to original publishers. Summaries are original AppStax text — we never republish full articles. Thumbnails from source feeds where available.'

export const ADMIN_KEY_STORAGE = 'appstax-radar-admin-key'

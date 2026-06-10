export const EDSTACK_PROJECTS_URL = 'https://appstax.ai/projects'

export const APP_TITLE = 'AppStax Radar'
export const APP_TITLE_MUTED = 'AppStax '
export const APP_TITLE_ACCENT = 'Radar'

export const APP_TAGLINE =
  'Curated AI development, agents, dev tools, and game-tech news — Scout finds it, you approve what ships.'

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
  'Summaries are original AppStax text with links to sources. No public accounts — review queue is key-protected. Google Gemini.'

export const ADMIN_KEY_STORAGE = 'appstax-radar-admin-key'

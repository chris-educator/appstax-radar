import { AppTitle } from './AppTitle'
import { Footer } from './Footer'
import { SiteTopBar } from './SiteTopBar'
import { ShareMenu } from './ShareMenu'
import { EdStackThemeSwitch } from './EdStackThemeSwitch'
import { TopNav } from './TopNav'
import { APP_TAGLINE } from '../constants/branding'

type LayoutProps = { children: React.ReactNode }

export function Layout({ children }: LayoutProps) {
  return (
    <div id="top" className="flex min-h-screen min-h-[100dvh] w-full max-w-[100vw] flex-col bg-bg">
      <SiteTopBar>
        <EdStackThemeSwitch />
        <ShareMenu />
      </SiteTopBar>
      <header className="ui-header relative z-40 shrink-0 px-4 py-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-6xl space-y-3">
          <AppTitle />
          <p className="max-w-full text-sm leading-relaxed text-text-muted">{APP_TAGLINE}</p>
          <TopNav />
        </div>
      </header>
      <main className="relative z-0 flex min-h-0 flex-1 flex-col overflow-x-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full min-w-0 max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
            {children}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  )
}

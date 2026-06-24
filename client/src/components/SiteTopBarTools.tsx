import type { ReactNode } from 'react'
import { CreditsTopBarLink } from './CreditsTopBarLink'
import { EdStackThemeSwitch } from './EdStackThemeSwitch'
import { SignInTopBarLink } from './SignInTopBarLink'
import { SignOutButton } from './SignOutButton'
import { ShareMenu } from './ShareMenu'

type SiteTopBarToolsProps = {
  showAsk?: boolean
  /** Pass `<AskAssistant apiReady={…} />` from each app that ships Ask. */
  askSlot?: ReactNode
  showBilling?: boolean
  signedIn?: boolean
  credits?: number
  accountTo?: string
  loginTo?: string
  onLogout?: () => void
  shareTriggerAriaLabel?: string
  /** Rendered in row 1 before credits / sign-in (e.g. skin picker). */
  primaryBeforeTheme?: ReactNode
  /** Rendered in row 2 before Ask. */
  secondaryBeforeAsk?: ReactNode
}

/**
 * Standard EdStack top-bar controls — AIOS order on desktop; two-row mobile grid.
 * Row 1 (beside logo): credits · sign in/out · theme (+ share when no Ask row).
 * Row 2 (full width): ask · share.
 */
export function SiteTopBarTools({
  showAsk = true,
  askSlot = null,
  showBilling = false,
  signedIn = false,
  credits = 0,
  accountTo = '/account',
  loginTo = '/login',
  onLogout,
  shareTriggerAriaLabel,
  primaryBeforeTheme,
  secondaryBeforeAsk,
}: SiteTopBarToolsProps) {
  const askControl = showAsk ? askSlot : null
  const secondaryRow = askControl || secondaryBeforeAsk

  return (
    <>
      <div className="site-top-bar__group-primary">
        {primaryBeforeTheme}
        {showBilling && signedIn ? (
          <CreditsTopBarLink credits={credits} to={accountTo} />
        ) : null}
        {showBilling && !signedIn ? <SignInTopBarLink to={loginTo} /> : null}
        {showBilling && signedIn && onLogout ? (
          <SignOutButton onClick={onLogout} />
        ) : null}
        <EdStackThemeSwitch />
        {!secondaryRow ? <ShareMenu triggerAriaLabel={shareTriggerAriaLabel} /> : null}
      </div>
      {secondaryRow ? (
        <div className="site-top-bar__group-secondary">
          {secondaryBeforeAsk}
          {askControl}
          <ShareMenu triggerAriaLabel={shareTriggerAriaLabel} />
        </div>
      ) : null}
    </>
  )
}

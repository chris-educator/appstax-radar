import { LogoMark } from './LogoMark'

interface LogoProps {
  size?: number
  tone?: 'light' | 'dark'
  /** Light bottom bar for logo mark on black backgrounds (e.g. footer) */
  markBottomBar?: 'dark' | 'light'
  /** Inherit font size from parent (e.g. hero headline) */
  inheritSize?: boolean
}

export function Logo({
  size = 28,
  tone = 'light',
  markBottomBar = 'dark',
  inheritSize = false,
}: LogoProps) {
  const appColor = tone === 'dark' ? '#FAFAFA' : '#09090B'
  return (
    <div
      className="inline-flex items-center gap-[0.35em]"
      style={
        inheritSize
          ? { fontSize: 'inherit', fontWeight: 800, letterSpacing: '-0.035em' }
          : undefined
      }
    >
      <LogoMark
        size={size}
        emSize={inheritSize}
        bottomBar={markBottomBar}
        className="shrink-0"
      />
      <span
        className="font-heading"
        style={{
          fontWeight: 800,
          fontSize: inheritSize ? 'inherit' : 18,
          letterSpacing: inheritSize ? 'inherit' : '-0.02em',
        }}
      >
        <span style={{ color: appColor }}>App</span>
        <span style={{ color: 'var(--color-primary)' }}>Stax</span>
      </span>
    </div>
  )
}

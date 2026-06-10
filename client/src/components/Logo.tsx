import { LogoMark } from './LogoMark'

export function Logo({ size = 28, tone = 'light' as 'light' | 'dark' }) {
  const edColor = tone === 'dark' ? '#FAFAFA' : '#09090B'
  return (
    <div className="inline-flex items-center gap-[0.35em]">
      <LogoMark size={size} className="shrink-0" />
      <span className="font-heading" style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
        <span style={{ color: edColor }}>Ed</span>
        <span style={{ color: '#0084FF' }}>Stack</span>
      </span>
    </div>
  )
}

import { AppStaxMark } from './AppStaxMark'

type SignOutButtonProps = {
  onClick: () => void
}

export function SignOutButton({ onClick }: SignOutButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="site-top-bar__icon-btn site-top-bar__sign-out"
      aria-label="Sign out"
      title="Sign out"
    >
      <AppStaxMark size={20} />
    </button>
  )
}

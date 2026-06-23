import { Link } from 'react-router-dom'

type SignInTopBarLinkProps = {
  to: string
}

export function SignInTopBarLink({ to }: SignInTopBarLinkProps) {
  return (
    <Link to={to} className="site-top-bar__action site-top-bar__sign-in">
      Sign in
    </Link>
  )
}

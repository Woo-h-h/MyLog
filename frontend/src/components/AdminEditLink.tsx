import { Link } from 'react-router-dom'
import { isLoggedIn } from '../auth/storage'

export function AdminEditLink({ to, label = '编辑此页' }: { to: string; label?: string }) {
  if (!isLoggedIn()) return null
  return (
    <Link to={to} className="geek-btn-secondary inline-flex px-3 py-1.5 text-xs">
      {label}
    </Link>
  )
}

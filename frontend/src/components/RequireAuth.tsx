import { Navigate, Outlet } from 'react-router-dom'
import { isLoggedIn } from '../auth/storage'

export function RequireAuth() {
  if (!isLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }
  return <Outlet />
}

import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { login } from '../../api/admin'
import { isLoggedIn, setAuth } from '../../auth/storage'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (isLoggedIn()) {
    return <Navigate to="/admin" replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await login(username, password)
      setAuth(res.token, res.username)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] px-4">
      <form
        onSubmit={onSubmit}
        className="geek-card w-full max-w-sm space-y-4 p-6"
      >
        <h1 className="font-[family-name:var(--font-display)] text-2xl">管理登录</h1>
        <p className="text-sm text-[var(--color-muted)]">默认账号 admin / admin123（仅开发环境）</p>
        <label className="block space-y-1 text-sm">
          <span>用户名</span>
          <input
            className="geek-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>密码</span>
          <input
            type="password"
            className="geek-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="geek-btn-primary w-full px-4 py-2 disabled:opacity-60"
        >
          {loading ? '登录中…' : '登录'}
        </button>
      </form>
    </div>
  )
}

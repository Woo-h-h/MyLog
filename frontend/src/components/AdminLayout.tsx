import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearAuth, getUsername } from '../auth/storage'

const items = [
  { to: '/admin', label: '概览', end: true },
  { to: '/admin/profile', label: '个人资料' },
  { to: '/admin/projects', label: '项目' },
  { to: '/admin/posts', label: '文章' },
  { to: '/admin/resume', label: '简历' },
  { to: '/admin/awards', label: '荣誉奖项' },
  { to: '/admin/student-work', label: '学生工作' },
]

export function AdminLayout() {
  const navigate = useNavigate()
  const username = getUsername()

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)] md:flex">
      <aside className="border-b border-[var(--color-line)] bg-[var(--color-card)] md:w-56 md:border-b-0 md:border-r">
        <div className="px-4 py-5">
          <Link to="/admin" className="font-[family-name:var(--font-display)] text-lg text-[var(--color-ink)]">
            Mylog Admin
          </Link>
          <p className="mt-1 text-xs text-[var(--color-muted)]">{username}</p>
        </div>
        <nav className="flex flex-wrap gap-1 px-3 pb-4 md:flex-col">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'rounded-md px-3 py-2 text-sm',
                  isActive
                    ? 'bg-[var(--color-link-blue)] text-[var(--color-black)]'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-link-blue)]',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-2 border-t border-[var(--color-line)] px-4 py-4 text-sm">
          <Link to="/" className="block text-[var(--color-accent)] hover:underline">
            查看前台
          </Link>
          <button
            type="button"
            className="text-[var(--color-muted)] hover:text-[var(--color-link-blue)]"
            onClick={() => {
              clearAuth()
              navigate('/admin/login')
            }}
          >
            退出登录
          </button>
        </div>
      </aside>
      <main className="flex-1 px-5 py-8 md:px-8">
        <Outlet />
      </main>
    </div>
  )
}

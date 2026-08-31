import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { trackPageView } from '../api/pageviews'
import { fetchProfile } from '../api/profile'
import { PageMeta } from './PageMeta'

const navItems = [
  { to: '/', label: '首页', end: true },
  { to: '/projects', label: '项目' },
  { to: '/blog', label: '博客' },
  { to: '/student-work', label: '学生工作' },
  { to: '/notes', label: '笔记' },
]

function siteBrand(displayName: string | null) {
  const name = displayName?.trim()
  return name ? `Mylog · ${name}` : 'Mylog'
}

function pageTitle(displayName: string | null, page: string) {
  return `${page} · ${siteBrand(displayName)}`
}

export function Layout() {
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const routeMeta = useMemo(
    () => ({
      '/': {
        title: siteBrand(displayName),
        description: '个人作品集网站：项目、博客、笔记与在线简历。',
      },
      '/projects': {
        title: pageTitle(displayName, '项目'),
        description: '项目作品集与技术实践。',
      },
      '/blog': {
        title: pageTitle(displayName, '博客'),
        description: '技术博客：工程实践与项目复盘。',
      },
      '/student-work': {
        title: pageTitle(displayName, '学生工作'),
        description: '学生工作与组织经历。',
      },
      '/notes': {
        title: pageTitle(displayName, '笔记'),
        description: '技术笔记速查与知识点整理。',
      },
    }),
    [displayName],
  )

  const metaKey = Object.keys(routeMeta).find((k) =>
    k === '/' ? location.pathname === '/' : location.pathname.startsWith(k),
  )
  const meta = (metaKey && routeMeta[metaKey as keyof typeof routeMeta]) || routeMeta['/']

  useEffect(() => {
    let cancelled = false
    fetchProfile()
      .then((p) => {
        if (!cancelled) {
          setDisplayName(p.displayName ?? null)
          setEmail(p.email ?? null)
        }
      })
      .catch(() => {
        /* footer contact is optional */
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    trackPageView(location.pathname + location.search)
  }, [location.pathname, location.search])

  const footerLabel = displayName?.trim() ? `${displayName.trim()} · Mylog` : 'Mylog'

  return (
    <div className="min-h-screen flex flex-col">
      <PageMeta title={meta.title} description={meta.description} />
      <header className="sticky top-0 z-20 border-b border-[var(--color-line)] bg-[var(--color-carbon)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Link
            to="/"
            className="font-[family-name:var(--font-display)] text-lg tracking-tight text-[var(--color-ink)]"
          >
            {siteBrand(displayName)}
          </Link>
          <button
            type="button"
            className="geek-btn-secondary rounded-md px-3 py-1.5 md:hidden"
            aria-expanded={menuOpen}
            aria-label="菜单"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? '关闭' : '菜单'}
          </button>
          <nav
            className={[
              'flex-wrap items-center gap-1 text-sm',
              menuOpen ? 'absolute left-0 right-0 top-full flex border-b border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-3 shadow-sm' : 'hidden',
              'md:static md:flex md:border-0 md:bg-transparent md:p-0 md:shadow-none',
            ].join(' ')}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    'rounded-md px-2.5 py-1.5 transition-colors',
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
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--color-line)] py-6 text-center text-sm text-[var(--color-muted)]">
        <p>© {new Date().getFullYear()} {footerLabel}</p>
        {email && (
          <p className="mt-1">
            <span>{email}</span>
          </p>
        )}
      </footer>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { trackPageView } from '../api/pageviews'
import { fetchProfile } from '../api/profile'
import { PageMeta } from './PageMeta'

const navItems = [
  { to: '/', label: '首页', end: true },
  { to: '/resume', label: '简历' },
  { to: '/projects', label: '项目' },
  { to: '/blog', label: '博客' },
  { to: '/student-work', label: '学生工作' },
  { to: '/notes', label: '笔记' },
]

const routeMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: '王焕 · Mylog',
    description: '王焕的个人网站｜Java 后端｜RAG / Agent 工程化｜湖南大学',
  },
  '/resume': {
    title: '简历 · 王焕 · Mylog',
    description: '王焕在线简历与 PDF 下载｜湖南大学｜Java 后端。',
  },
  '/projects': {
    title: '项目 · 王焕 · Mylog',
    description: '王焕的项目作品集与个人介绍：RAG、Agent、Spring Boot 等落地实践。',
  },
  '/blog': {
    title: '博客 · 王焕 · Mylog',
    description: '技术博客：RAG、Agent、后端工程实践。',
  },
  '/student-work': {
    title: '学生工作 · 王焕 · Mylog',
    description: '王焕在校期间的学生工作与组织经历。',
  },
  '/notes': {
    title: '笔记 · 王焕 · Mylog',
    description: '技术笔记速查：Redis、缓存、后端知识点。',
  },
}

export function Layout() {
  const [email, setEmail] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const metaKey = Object.keys(routeMeta).find((k) =>
    k === '/' ? location.pathname === '/' : location.pathname.startsWith(k),
  )
  const meta = (metaKey && routeMeta[metaKey]) || routeMeta['/']

  useEffect(() => {
    let cancelled = false
    fetchProfile()
      .then((p) => {
        if (!cancelled) setEmail(p.email ?? null)
      })
      .catch(() => {
        /* footer email is optional */
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    trackPageView(location.pathname + location.search)
  }, [location.pathname, location.search])

  return (
    <div className="min-h-screen flex flex-col">
      <PageMeta title={meta.title} description={meta.description} />
      <header className="sticky top-0 z-20 border-b border-[var(--color-line)] bg-[var(--color-carbon)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Link
            to="/"
            className="font-[family-name:var(--font-display)] text-lg tracking-tight text-[var(--color-ink)]"
          >
            Mylog · 王焕
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
        <p>© {new Date().getFullYear()} 王焕 · Mylog</p>
        {email && (
          <p className="mt-1">
            <a className="text-[var(--color-link-blue)] hover:brightness-110" href={`mailto:${email}`}>
              {email}
            </a>
          </p>
        )}
      </footer>
    </div>
  )
}

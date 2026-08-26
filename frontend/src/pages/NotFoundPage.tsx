import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'

export function NotFoundPage() {
  return (
    <div className="space-y-4 py-10 text-center">
      <PageMeta title="页面不存在 · 王焕 · Mylog" description="你访问的页面不存在。" />
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-link-blue)]">404</p>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">页面不存在</h1>
      <p className="text-[var(--color-muted)]">链接可能已失效，或地址输入有误。</p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link to="/" className="geek-btn-primary">
          回首页
        </Link>
        <Link to="/projects" className="geek-btn-secondary">
          看项目
        </Link>
      </div>
    </div>
  )
}

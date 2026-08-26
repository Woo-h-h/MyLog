import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, getData } from '../../api/client'

interface PageViewItem {
  path: string
  viewCount: number
}

export function AdminHomePage() {
  const [views, setViews] = useState<PageViewItem[]>([])

  useEffect(() => {
    getData<PageViewItem[]>(api.get('/admin/pageviews'))
      .then(setViews)
      .catch(() => setViews([]))
  }, [])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">管理后台</h1>
        <p className="text-[var(--color-muted)]">
          在此更新个人资料、项目、文章、简历与学生工作。修改后刷新前台即可看到效果。
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm">
          <li>
            <Link className="text-[var(--color-accent)] hover:underline" to="/admin/profile">
              编辑个人资料（一句话定位）
            </Link>
          </li>
          <li>
            <Link className="text-[var(--color-accent)] hover:underline" to="/admin/projects">
              管理项目
            </Link>
          </li>
          <li>
            <Link className="text-[var(--color-accent)] hover:underline" to="/admin/posts">
              管理博客 / 笔记
            </Link>
          </li>
          <li>
            <Link className="text-[var(--color-accent)] hover:underline" to="/admin/resume">
              编辑简历（PDF + 正文）
            </Link>
          </li>
          <li>
            <Link className="text-[var(--color-accent)] hover:underline" to="/admin/student-work">
              编辑学生工作
            </Link>
          </li>
        </ul>
      </div>

      <section className="space-y-3 border-t border-[var(--color-line)] pt-6">
        <h2 className="font-[family-name:var(--font-display)] text-xl">访问统计（Top）</h2>
        {views.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">暂无数据，浏览前台页面后会出现。</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {views.slice(0, 10).map((v) => (
              <li key={v.path} className="flex justify-between gap-4 border-t border-[var(--color-line)] pt-2">
                <span className="truncate">{v.path}</span>
                <span className="text-[var(--color-muted)]">{v.viewCount}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

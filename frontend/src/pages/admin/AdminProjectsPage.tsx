import { useEffect, useState, type FormEvent } from 'react'
import {
  createAdminProject,
  deleteAdminProject,
  fetchAdminProjects,
  updateAdminProject,
  type AdminProject,
} from '../../api/admin'

const empty: Partial<AdminProject> = {
  slug: '',
  title: '',
  summary: '',
  content: '',
  techStack: '',
  sortOrder: 0,
  featured: false,
  published: true,
}

export function AdminProjectsPage() {
  const [items, setItems] = useState<AdminProject[]>([])
  const [editing, setEditing] = useState<Partial<AdminProject>>(empty)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    setItems(await fetchAdminProjects())
  }

  useEffect(() => {
    reload().catch((e) => setError(e instanceof Error ? e.message : '加载失败'))
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      if (editing.id) {
        await updateAdminProject(editing.id, editing)
      } else {
        await createAdminProject(editing)
      }
      setEditing(empty)
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">项目管理</h1>
      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}

      <div className="space-y-2">
        {items.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-line)] pt-3">
            <div>
              <p className="font-medium">
                {p.title}{' '}
                <span className="text-xs text-[var(--color-muted)]">
                  {p.published ? '已发布' : '草稿'} {p.featured ? '· 精选' : ''}
                </span>
              </p>
              <p className="text-xs text-[var(--color-muted)]">{p.slug}</p>
            </div>
            <div className="flex gap-2 text-sm">
              <button type="button" className="text-[var(--color-accent)]" onClick={() => setEditing(p)}>
                编辑
              </button>
              <button
                type="button"
                className="text-[var(--color-error)]"
                onClick={async () => {
                  await deleteAdminProject(p.id)
                  await reload()
                }}
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="geek-card max-w-2xl space-y-3 p-4">
        <h2 className="font-medium">{editing.id ? `编辑 #${editing.id}` : '新建项目'}</h2>
        {(
          [
            ['slug', 'slug'],
            ['title', '标题'],
            ['summary', '摘要'],
            ['techStack', '技术栈（逗号分隔）'],
            ['githubUrl', 'GitHub'],
            ['demoUrl', '演示'],
            ['startDate', '开始'],
            ['endDate', '结束'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block space-y-1 text-sm">
            <span>{label}</span>
            <input
              className="geek-input"
              value={(editing[key] as string) ?? ''}
              onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
              required={key === 'slug' || key === 'title' || key === 'summary'}
            />
          </label>
        ))}
        <label className="block space-y-1 text-sm">
          <span>正文</span>
          <textarea
            className="geek-input min-h-32"
            value={editing.content ?? ''}
            onChange={(e) => setEditing({ ...editing, content: e.target.value })}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>排序</span>
          <input
            type="number"
            className="w-full rounded-md border border-[var(--color-line)] px-3 py-2"
            value={editing.sortOrder ?? 0}
            onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })}
          />
        </label>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(editing.featured)}
              onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
            />
            精选
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editing.published !== false}
              onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
            />
            发布
          </label>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="geek-btn-primary px-4 py-2">
            保存
          </button>
          <button type="button" className="rounded-md border px-4 py-2 text-sm" onClick={() => setEditing(empty)}>
            清空
          </button>
        </div>
      </form>
    </div>
  )
}

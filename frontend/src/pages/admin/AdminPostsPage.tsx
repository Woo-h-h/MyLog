import { useEffect, useState, type FormEvent } from 'react'
import {
  createAdminPost,
  deleteAdminPost,
  fetchAdminPosts,
  updateAdminPost,
  type AdminPost,
} from '../../api/admin'

const empty: Partial<AdminPost> = {
  slug: '',
  title: '',
  summary: '',
  content: '',
  type: 'blog',
  status: 'published',
  tags: [],
}

export function AdminPostsPage() {
  const [items, setItems] = useState<AdminPost[]>([])
  const [editing, setEditing] = useState<Partial<AdminPost>>(empty)
  const [tagsText, setTagsText] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    setItems(await fetchAdminPosts())
  }

  useEffect(() => {
    reload().catch((e) => setError(e instanceof Error ? e.message : '加载失败'))
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const payload = {
      ...editing,
      tags: tagsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }
    try {
      if (editing.id) {
        await updateAdminPost(editing.id, payload)
      } else {
        await createAdminPost(payload)
      }
      setEditing(empty)
      setTagsText('')
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">文章管理</h1>
      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}

      <div className="space-y-2">
        {items.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-line)] pt-3">
            <div>
              <p className="font-medium">
                [{p.type}] {p.title}{' '}
                <span className="text-xs text-[var(--color-muted)]">{p.status}</span>
              </p>
              <p className="text-xs text-[var(--color-muted)]">{p.slug}</p>
            </div>
            <div className="flex gap-2 text-sm">
              <button
                type="button"
                className="text-[var(--color-accent)]"
                onClick={() => {
                  setEditing(p)
                  setTagsText((p.tags ?? []).join(', '))
                }}
              >
                编辑
              </button>
              <button
                type="button"
                className="text-[var(--color-error)]"
                onClick={async () => {
                  await deleteAdminPost(p.id)
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
        <h2 className="font-medium">{editing.id ? `编辑 #${editing.id}` : '新建文章'}</h2>
        <label className="block space-y-1 text-sm">
          <span>类型</span>
          <select
            className="geek-input"
            value={editing.type ?? 'blog'}
            onChange={(e) => setEditing({ ...editing, type: e.target.value })}
          >
            <option value="blog">blog</option>
            <option value="note">note</option>
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span>状态</span>
          <select
            className="geek-input"
            value={editing.status ?? 'published'}
            onChange={(e) => setEditing({ ...editing, status: e.target.value })}
          >
            <option value="published">published</option>
            <option value="draft">draft</option>
          </select>
        </label>
        {(
          [
            ['slug', 'slug'],
            ['title', '标题'],
            ['summary', '摘要'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block space-y-1 text-sm">
            <span>{label}</span>
            <input
              className="geek-input"
              value={(editing[key] as string) ?? ''}
              onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
              required={key === 'slug' || key === 'title'}
            />
          </label>
        ))}
        <label className="block space-y-1 text-sm">
          <span>标签（逗号分隔）</span>
          <input
            className="geek-input"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Markdown 正文</span>
          <textarea
            className="geek-input min-h-40 font-mono text-sm"
            value={editing.content ?? ''}
            onChange={(e) => setEditing({ ...editing, content: e.target.value })}
            required
          />
        </label>
        <div className="flex gap-2">
          <button type="submit" className="geek-btn-primary px-4 py-2">
            保存
          </button>
          <button
            type="button"
            className="rounded-md border px-4 py-2 text-sm"
            onClick={() => {
              setEditing(empty)
              setTagsText('')
            }}
          >
            清空
          </button>
        </div>
      </form>
    </div>
  )
}

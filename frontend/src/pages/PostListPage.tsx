import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchPosts, fetchTags } from '../api/posts'
import { EmptyState, LoadingState } from '../components/UiStates'
import { AdminEditLink } from '../components/AdminEditLink'
import type { PostSummary, TagItem } from '../types/post'

type PostKind = 'blog' | 'note'

export function PostListPage({ type }: { type: PostKind }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const tag = searchParams.get('tag') ?? undefined
  const [posts, setPosts] = useState<PostSummary[]>([])
  const [tags, setTags] = useState<TagItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const title = type === 'blog' ? '博客' : '笔记'
  const basePath = type === 'blog' ? '/blog' : '/notes'

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const [page, allTags] = await Promise.all([
          fetchPosts({ type, tag, size: 20 }),
          fetchTags(),
        ])
        if (!cancelled) {
          setPosts(page.items)
          setTags(allTags)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : '加载失败')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [type, tag])

  const activeTagName = useMemo(
    () => tags.find((t) => t.slug === tag)?.name ?? tag,
    [tags, tag],
  )

  if (loading) return <LoadingState />
  if (error) {
    return (
      <div className="alert-error">
        无法加载{title}：{error}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <AdminEditLink to="/admin/posts" label="管理文章" />
      </div>
      <div className="space-y-2">
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">{title}</h1>
        <p className="text-[var(--color-muted)]">
          {type === 'blog' ? '中长文，展示思考与工程实践。' : '短笔记，快速检索知识点。'}
        </p>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className={[
              'rounded-full border px-3 py-1 text-xs transition',
              !tag
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-dim)] text-[var(--color-accent)]'
                : 'border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-line-glow)] hover:text-[var(--color-accent)]',
            ].join(' ')}
          >
            全部
          </button>
          {tags.map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => setSearchParams({ tag: t.slug })}
              className={[
                'rounded-full border px-3 py-1 text-xs transition',
                tag === t.slug
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-dim)] text-[var(--color-accent)]'
                  : 'border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-line-glow)] hover:text-[var(--color-accent)]',
              ].join(' ')}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {tag && (
        <p className="text-sm text-[var(--color-muted)]">
          当前标签：{activeTagName}{' '}
          <button type="button" className="text-[var(--color-accent)] hover:underline" onClick={() => setSearchParams({})}>
            清除
          </button>
        </p>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <EmptyState title={`暂无${title}`} hint="可在管理后台发布内容。" />
        ) : (
          posts.map((p) => (
          <Link
            key={p.slug}
            to={`${basePath}/${p.slug}`}
            className="block border-t border-[var(--color-line)] pt-4 transition hover:opacity-90"
          >
            <h2 className="font-medium">{p.title}</h2>
            {p.publishedAt && (
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                {new Date(p.publishedAt).toLocaleDateString('zh-CN')}
              </p>
            )}
            {p.summary && <p className="mt-2 text-sm text-[var(--color-muted)]">{p.summary}</p>}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span key={t} className="geek-tag px-2 py-0.5 text-xs text-[var(--color-muted)]">
                  {t}
                </span>
              ))}
            </div>
          </Link>
          ))
        )}
      </div>
    </div>
  )
}

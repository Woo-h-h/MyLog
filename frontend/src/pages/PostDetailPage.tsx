import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchPost } from '../api/posts'
import { Markdown } from '../components/Markdown'
import type { PostDetail } from '../types/post'

export function PostDetailPage({ type }: { type: 'blog' | 'note' }) {
  const { slug } = useParams()
  const [post, setPost] = useState<PostDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const listPath = type === 'blog' ? '/blog' : '/notes'
  const listLabel = type === 'blog' ? '博客' : '笔记'

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchPost(slug)
        if (!cancelled) {
          if (data.type !== type) {
            setError('内容类型不匹配')
          } else {
            setPost(data)
          }
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
  }, [slug, type])

  if (loading) return <p className="text-[var(--color-muted)]">加载中…</p>
  if (error || !post) {
    return (
      <div className="space-y-4">
        <div className="alert-error">
          无法加载文章：{error ?? '未找到'}
        </div>
        <Link to={listPath} className="text-sm text-[var(--color-accent)] hover:underline">
          返回{listLabel}列表
        </Link>
      </div>
    )
  }

  return (
    <article className="space-y-6">
      <Link to={listPath} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]">
        ← {listLabel}列表
      </Link>
      <header className="space-y-3">
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight md:text-4xl">
          {post.title}
        </h1>
        {post.publishedAt && (
          <p className="text-sm text-[var(--color-muted)]">
            {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
          </p>
        )}
        {post.summary && <p className="text-[var(--color-muted)]">{post.summary}</p>}
        <div className="flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="rounded-full border border-[var(--color-line)] px-3 py-1 text-xs">
              {t}
            </span>
          ))}
        </div>
      </header>
      <Markdown content={post.content} />
    </article>
  )
}

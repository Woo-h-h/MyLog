import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProject } from '../api/projects'
import type { ProjectDetail } from '../types/profile'

export function ProjectDetailPage() {
  const { slug } = useParams()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchProject(slug)
        if (!cancelled) setProject(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : '加载失败')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) return <p className="text-[var(--color-muted)]">加载中…</p>
  if (error || !project) {
    return (
      <div className="space-y-4">
        <div className="alert-error">
          无法加载项目：{error ?? '未找到'}
        </div>
        <Link to="/projects" className="text-sm text-[var(--color-accent)] hover:underline">
          返回项目列表
        </Link>
      </div>
    )
  }

  return (
    <article className="space-y-8">
      <div className="space-y-3">
        <Link to="/projects" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]">
          ← 项目列表
        </Link>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight md:text-4xl">
          {project.title}
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          {[project.startDate, project.endDate].filter(Boolean).join(' – ')}
          {project.featured ? ' · 精选' : ''}
        </p>
        <p className="max-w-3xl text-base leading-relaxed text-[var(--color-muted)]">{project.summary}</p>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((t) => (
            <span
              key={t}
              className="rounded-full border border-[var(--color-line)] px-3 py-1 text-xs"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          {project.githubUrl && (
            <a className="text-[var(--color-accent)] hover:underline" href={project.githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          {project.demoUrl && (
            <a className="text-[var(--color-accent)] hover:underline" href={project.demoUrl} target="_blank" rel="noreferrer">
              演示
            </a>
          )}
        </div>
      </div>

      <div className="prose-mylog max-w-3xl space-y-4 text-[15px] leading-7 whitespace-pre-wrap">
        {project.content}
      </div>
    </article>
  )
}

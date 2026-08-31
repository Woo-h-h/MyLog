import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchGithubReadme } from '../api/githubReadme'
import { fetchProject } from '../api/projects'
import { Markdown } from '../components/Markdown'
import type { ProjectDetail } from '../types/profile'

export function ProjectDetailPage() {
  const { slug } = useParams()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [body, setBody] = useState<string>('')
  const [assetBaseUrl, setAssetBaseUrl] = useState<string | undefined>()
  const [fromReadme, setFromReadme] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [readmeLoading, setReadmeLoading] = useState(false)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      setBody('')
      setAssetBaseUrl(undefined)
      setFromReadme(false)
      try {
        const data = await fetchProject(slug)
        if (cancelled) return
        setProject(data)

        if (data.githubUrl) {
          setReadmeLoading(true)
          try {
            const readme = await fetchGithubReadme(data.githubUrl)
            if (cancelled) return
            setBody(readme.markdown)
            setAssetBaseUrl(readme.rawBaseUrl)
            setFromReadme(true)
          } catch {
            if (cancelled) return
            setBody(data.content)
            setFromReadme(false)
          } finally {
            if (!cancelled) setReadmeLoading(false)
          }
        } else {
          setBody(data.content)
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
  }, [slug])

  if (loading) return <p className="text-[var(--color-muted)]">加载中…</p>
  if (error || !project) {
    return (
      <div className="space-y-4">
        <div className="alert-error">无法加载项目：{error ?? '未找到'}</div>
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
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {project.githubUrl && (
            <a
              className="text-[var(--color-accent)] hover:underline"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}
          {project.demoUrl && (
            <a
              className="text-[var(--color-accent)] hover:underline"
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
            >
              演示
            </a>
          )}
          {fromReadme && (
            <span className="text-xs text-[var(--color-muted)]">正文来自仓库 README</span>
          )}
        </div>
      </div>

      {readmeLoading ? (
        <p className="text-sm text-[var(--color-muted)]">正在加载 GitHub README…</p>
      ) : (
        <Markdown content={body} assetBaseUrl={assetBaseUrl} />
      )}
    </article>
  )
}

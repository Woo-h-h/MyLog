import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProfile } from '../api/profile'
import { fetchProjects } from '../api/projects'
import { EmptyState, LoadingState } from '../components/UiStates'
import { PageHero } from '../components/PageHero'
import type { Profile, ProjectSummary } from '../types/profile'

export function ProjectsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [p, data] = await Promise.all([fetchProfile(), fetchProjects()])
        if (!cancelled) {
          setProfile(p)
          setProjects(data)
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
  }, [])

  if (loading) return <LoadingState />
  if (error) {
    return <div className="alert-error">无法加载项目：{error}</div>
  }

  return (
    <div className="space-y-12">
      <PageHero
        label="Projects"
        title="项目"
        description={profile?.bio ?? profile?.tagline ?? '结果导向的项目摘要，点击查看细节。'}
      />

      {projects.length === 0 ? (
        <EmptyState title="暂无项目" hint="稍后在管理后台添加作品。" />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((p) => (
            <div key={p.slug} className="geek-card p-5">
              <Link to={`/projects/${p.slug}`} className="group block">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-medium group-hover:text-[var(--color-accent)]">{p.title}</h2>
                  {p.featured && (
                    <span className="shrink-0 text-xs text-[var(--color-accent)]">精选</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  {[p.startDate, p.endDate].filter(Boolean).join(' – ')}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{p.summary}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.techStack.slice(0, 5).map((t) => (
                    <span key={t} className="rounded bg-[var(--color-surface)] px-2 py-0.5 text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
              {p.githubUrl && (
                <a
                  className="mt-3 inline-block text-sm text-[var(--color-accent)] hover:underline"
                  href={p.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {profile && (
        <section id="contact" className="space-y-3 border-t border-[var(--color-line)] pt-10">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)]">联系</h2>
          <div className="space-y-2 text-sm text-[var(--color-muted)]">
            {profile.email && (
              <p>
                邮箱：{' '}
                <span>{profile.email}</span>
              </p>
            )}
            {profile.githubUrl && (
              <p>
                GitHub：{' '}
                <a
                  className="text-[var(--color-accent)] hover:underline"
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {profile.githubUrl}
                </a>
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

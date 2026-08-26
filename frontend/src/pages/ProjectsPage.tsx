import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProfile } from '../api/profile'
import { fetchProjects } from '../api/projects'
import { EmptyState, LoadingState } from '../components/UiStates'
import { AdminEditLink } from '../components/AdminEditLink'
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
      <div className="flex justify-end">
        <AdminEditLink to="/admin/projects" />
      </div>
      <div className="space-y-3">
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--color-ink)]">
          项目
        </h1>
        {profile?.tagline && (
          <p className="text-lg text-[var(--color-ink)]/90">{profile.tagline}</p>
        )}
        {profile?.bio && (
          <p className="max-w-2xl text-base leading-relaxed text-[var(--color-muted)]">{profile.bio}</p>
        )}
        {!profile?.bio && (
          <p className="text-[var(--color-muted)]">结果导向的项目摘要，点击查看细节。</p>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyState title="暂无项目" hint="稍后在管理后台添加作品。" />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((p) => (
            <Link key={p.slug} to={`/projects/${p.slug}`} className="group geek-card p-5">
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
                <a className="text-[var(--color-accent)] hover:underline" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </p>
            )}
            {profile.phone && <p>手机：{profile.phone}</p>}
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

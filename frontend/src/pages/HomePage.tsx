import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPosts } from '../api/posts'
import { fetchProfile } from '../api/profile'
import { fetchProjects } from '../api/projects'
import { fetchResume, resumeDownloadUrl } from '../api/resume'
import { LoadingState } from '../components/UiStates'
import { AdminEditLink } from '../components/AdminEditLink'
import type { PostSummary } from '../types/post'
import type { Profile, ProjectSummary } from '../types/profile'

export function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [featured, setFeatured] = useState<ProjectSummary[]>([])
  const [latestPosts, setLatestPosts] = useState<PostSummary[]>([])
  const [resumePdfReady, setResumePdfReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [p, projects, blogs, resume] = await Promise.all([
          fetchProfile(),
          fetchProjects(true),
          fetchPosts({ type: 'blog', size: 3 }),
          fetchResume().catch(() => null),
        ])
        if (!cancelled) {
          setProfile(p)
          setFeatured(projects.slice(0, 3))
          setLatestPosts(blogs.items)
          setResumePdfReady(resume?.pdfAvailable ?? false)
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

  if (loading) {
    return <LoadingState />
  }

  if (error || !profile) {
    return (
      <div className="alert-error">
        无法加载个人资料：{error ?? '未知错误'}。请确认后端已在 8080 端口运行。
      </div>
    )
  }

  return (
    <div className="space-y-14">
      <div className="flex justify-end">
        <AdminEditLink to="/admin/profile" />
      </div>
      <section className="gradient-hero space-y-6">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-link-blue)]">Personal Site</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl leading-tight tracking-tight text-[var(--color-ink)] md:text-5xl">
          {profile.displayName}
        </h1>
        <p className="max-w-2xl text-xl text-[var(--color-ink)]/90 md:text-2xl">{profile.tagline}</p>
        {profile.subtitle && (
          <p className="max-w-2xl text-base leading-relaxed text-[var(--color-muted)]">{profile.subtitle}</p>
        )}
        <div className="flex flex-wrap gap-3 pt-2">
          {resumePdfReady ? (
            <a href={resumeDownloadUrl()} className="geek-btn-primary">
              下载简历
            </a>
          ) : (
            <Link to="/resume" className="geek-btn-primary">
              查看简历
            </Link>
          )}
          <Link to="/projects" className="geek-btn-secondary">
            查看项目
          </Link>
          <Link
            to="/projects#contact"
            className="rounded-md px-5 py-2.5 text-sm text-[var(--color-muted)] underline-offset-4 hover:text-[var(--color-accent)] hover:underline"
          >
            联系我
          </Link>
        </div>
        {(profile.email || profile.phone) && (
          <p className="text-sm text-[var(--color-muted)]">
            {profile.email && (
              <a className="text-[var(--color-link-blue)] hover:brightness-110" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            )}
            {profile.email && profile.phone && <span className="mx-2">·</span>}
            {profile.phone && <span>{profile.phone}</span>}
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">技能</h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span key={skill} className="geek-tag">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-3 border-t border-[var(--color-line)] pt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-xl">精选项目</h2>
          <Link to="/projects" className="text-sm text-[var(--color-accent)] hover:underline">
            全部项目
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {featured.map((p) => (
            <Link
              key={p.slug}
              to={`/projects/${p.slug}`}
              className="geek-card block p-5"
            >
              <h3 className="font-medium">{p.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-[var(--color-muted)]">{p.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {latestPosts.length > 0 && (
        <section className="space-y-3 border-t border-[var(--color-line)] pt-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-[family-name:var(--font-display)] text-xl">最新文章</h2>
            <Link to="/blog" className="text-sm text-[var(--color-accent)] hover:underline">
              全部博客
            </Link>
          </div>
          <div className="space-y-3">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="block border-t border-[var(--color-line)] pt-3 first:border-t-0 first:pt-0"
              >
                <h3 className="font-medium">{post.title}</h3>
                {post.summary && (
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--color-muted)]">{post.summary}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

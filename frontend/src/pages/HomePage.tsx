import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProfile } from '../api/profile'
import { fetchResume, resumeDownloadUrl } from '../api/resume'
import { ContactIcons } from '../components/ContactIcons'
import { ResumeView } from '../components/ResumeView'
import { LoadingState } from '../components/UiStates'
import type { Profile } from '../types/profile'
import type { ResumeData } from '../types/resume'

export function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [p, resumeData] = await Promise.all([
          fetchProfile(),
          fetchResume().catch(() => null),
        ])
        if (!cancelled) {
          setProfile(p)
          setResume(resumeData)
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

  useEffect(() => {
    if (loading || window.location.hash !== '#resume') return
    document.getElementById('resume')?.scrollIntoView({ behavior: 'smooth' })
  }, [loading])

  if (loading) {
    return <LoadingState />
  }

  if (error || !profile) {
    return (
      <div className="alert-error">
        无法加载个人资料：{error ?? '未知错误'}。请确认后端已在运行。
      </div>
    )
  }

  return (
    <div className="space-y-14">
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
          {resume?.pdfAvailable ? (
            <a href={resumeDownloadUrl()} className="geek-btn-primary">
              下载简历
            </a>
          ) : (
            <a href="#resume" className="geek-btn-primary">
              查看简历
            </a>
          )}
          <Link to="/projects" className="geek-btn-secondary">
            查看项目
          </Link>
        </div>
        <ContactIcons email={profile.email} githubUrl={profile.githubUrl} />
      </section>

      <section id="resume" className="scroll-mt-24 space-y-6 border-t border-[var(--color-line)] pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">个人简介</h2>
          {resume?.pdfAvailable && (
            <a href={resumeDownloadUrl()} className="geek-btn-secondary text-sm">
              下载 PDF
            </a>
          )}
        </div>
        {resume ? (
          <ResumeView resume={resume} />
        ) : (
          <p className="text-sm text-[var(--color-muted)]">简历内容加载失败，请稍后刷新。</p>
        )}
      </section>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { resumeDownloadUrl, fetchResume } from '../api/resume'
import { AdminEditLink } from '../components/AdminEditLink'
import type { ResumeData } from '../types/profile'

export function ResumePage() {
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchResume()
        if (!cancelled) setResume(data)
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

  if (loading) return <p className="text-[var(--color-muted)]">加载中…</p>
  if (error || !resume) {
    return (
      <div className="alert-error">
        无法加载简历：{error ?? '未知错误'}
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-end">
        <AdminEditLink to="/admin/resume" />
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">简历</h1>
          <p className="max-w-2xl text-[var(--color-muted)]">{resume.summary}</p>
        </div>
        {resume.pdfAvailable ? (
          <a
            href={resumeDownloadUrl()}
            className="geek-btn-primary"
          >
            下载 PDF
          </a>
        ) : (
          <span className="text-sm text-[var(--color-muted)]">PDF 暂未就绪</span>
        )}
      </div>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">教育经历</h2>
        {resume.education.map((edu) => (
          <div key={edu.school + edu.period} className="border-t border-[var(--color-line)] pt-4">
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="font-medium">
                {edu.school} · {edu.major}
              </h3>
              <span className="text-sm text-[var(--color-muted)]">{edu.period}</span>
            </div>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {[edu.college, edu.degree, edu.gpa].filter(Boolean).join(' · ')}
            </p>
            {edu.honors && <p className="mt-2 text-sm leading-relaxed">{edu.honors}</p>}
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">实习经历</h2>
        {resume.internships.map((item) => (
          <div key={item.company + item.period} className="border-t border-[var(--color-line)] pt-4">
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="font-medium">
                {item.company} · {item.role}
              </h3>
              <span className="text-sm text-[var(--color-muted)]">{item.period}</span>
            </div>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {[item.location, item.project].filter(Boolean).join(' · ')}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              {item.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">项目经历</h2>
        {resume.projectSummaries.map((p) => (
          <div key={p.name} className="border-t border-[var(--color-line)] pt-4">
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="font-medium">{p.name}</h3>
              <span className="text-sm text-[var(--color-muted)]">{p.period}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{p.oneLiner}</p>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl">技能</h2>
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((s) => (
            <span
              key={s}
              className="geek-tag text-sm"
            >
              {s}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}

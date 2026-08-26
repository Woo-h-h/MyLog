import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchResume, resumeDownloadUrl, resumeViewUrl } from '../api/resume'
import { AdminEditLink } from '../components/AdminEditLink'
import type { ResumeInfo } from '../types/profile'

export function ResumePage() {
  const [resume, setResume] = useState<ResumeInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchResume()
      .then((data) => {
        if (!cancelled) setResume(data)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : '加载失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <p className="text-[var(--color-muted)]">加载中…</p>
  if (error || !resume) {
    return <div className="alert-error">无法加载简历：{error ?? '未知错误'}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <AdminEditLink to="/admin/resume" />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">简历</h1>
          {resume.filename && (
            <p className="text-sm text-[var(--color-muted)]">{resume.filename}</p>
          )}
        </div>
        {resume.pdfAvailable ? (
          <a href={resumeDownloadUrl()} className="geek-btn-primary">
            下载 PDF
          </a>
        ) : null}
      </div>

      {resume.pdfAvailable ? (
        <div className="overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-card)]">
          <iframe
            title="简历 PDF"
            src={resumeViewUrl()}
            className="h-[min(80vh,900px)] w-full"
          />
        </div>
      ) : (
        <div className="geek-card space-y-3 p-8 text-center">
          <p className="text-[var(--color-muted)]">尚未上传简历 PDF</p>
          <Link to="/admin/resume" className="text-[var(--color-accent)] hover:underline">
            去管理后台上传 PDF
          </Link>
        </div>
      )}
    </div>
  )
}

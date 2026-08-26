import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchAdminResumeContent,
  fetchResumeFiles,
  setCurrentResume,
  updateAdminResumeContent,
  uploadResume,
  type ResumeFileItem,
} from '../../api/admin'
import type { ResumeData } from '../../types/profile'

type ResumeContent = Omit<ResumeData, 'pdfAvailable'>

export function AdminResumePage() {
  const [files, setFiles] = useState<ResumeFileItem[]>([])
  const [contentJson, setContentJson] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [contentLoading, setContentLoading] = useState(true)

  async function reloadFiles() {
    setFiles(await fetchResumeFiles())
  }

  useEffect(() => {
    reloadFiles().catch((e) => setError(e instanceof Error ? e.message : '加载失败'))
    fetchAdminResumeContent()
      .then((data) => setContentJson(JSON.stringify(data, null, 2)))
      .catch((e) => setError(e instanceof Error ? e.message : '加载简历正文失败'))
      .finally(() => setContentLoading(false))
  }, [])

  async function onSaveContent(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    let parsed: ResumeContent
    try {
      parsed = JSON.parse(contentJson) as ResumeContent
    } catch {
      setError('JSON 格式无效，请检查括号与逗号。')
      return
    }
    try {
      await updateAdminResumeContent(parsed)
      setMessage('简历正文已保存。刷新前台 /resume 即可看到最新内容。')
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    }
  }

  return (
    <div className="max-w-3xl space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">简历</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">管理 PDF 下载与前台简历正文。</p>
        </div>
        <Link to="/resume" className="geek-btn-secondary text-sm">
          预览前台
        </Link>
      </div>

      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
      {message && <p className="text-sm text-[var(--color-accent)]">{message}</p>}

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">PDF 文件</h2>
        <p className="text-sm text-[var(--color-muted)]">上传新 PDF 后会自动设为当前下载版本。</p>
        <input
          type="file"
          accept="application/pdf,.pdf"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            setError(null)
            setMessage(null)
            try {
              await uploadResume(file)
              setMessage('PDF 上传成功')
              await reloadFiles()
            } catch (err) {
              setError(err instanceof Error ? err.message : '上传失败')
            } finally {
              e.target.value = ''
            }
          }}
        />
        <div className="space-y-3">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-line)] pt-3"
            >
              <div>
                <p className="font-medium">
                  {f.originalFilename}{' '}
                  {f.currentVersion && <span className="text-xs text-[var(--color-accent)]">当前</span>}
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  {new Date(f.uploadedAt).toLocaleString('zh-CN')}
                </p>
              </div>
              {!f.currentVersion && (
                <button
                  type="button"
                  className="text-sm text-[var(--color-accent)]"
                  onClick={async () => {
                    await setCurrentResume(f.id)
                    await reloadFiles()
                  }}
                >
                  设为当前
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={onSaveContent} className="space-y-4 border-t border-[var(--color-line)] pt-8">
        <h2 className="font-[family-name:var(--font-display)] text-xl">简历正文（JSON）</h2>
        <p className="text-sm text-[var(--color-muted)]">
          包含 summary、education、internships、projectSummaries、skills 等字段。保存后写入数据库，刷新前台生效。
        </p>
        {contentLoading ? (
          <p className="text-sm text-[var(--color-muted)]">加载正文…</p>
        ) : (
          <textarea
            className="min-h-[28rem] w-full font-mono text-xs geek-input"
            value={contentJson}
            onChange={(e) => setContentJson(e.target.value)}
            spellCheck={false}
          />
        )}
        <button type="submit" className="geek-btn-primary" disabled={contentLoading}>
          保存正文
        </button>
      </form>
    </div>
  )
}

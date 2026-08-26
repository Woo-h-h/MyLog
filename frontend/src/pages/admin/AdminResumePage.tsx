import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchResumeFiles,
  setCurrentResume,
  uploadResume,
  type ResumeFileItem,
} from '../../api/admin'

export function AdminResumePage() {
  const [files, setFiles] = useState<ResumeFileItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function reloadFiles() {
    setFiles(await fetchResumeFiles())
  }

  useEffect(() => {
    reloadFiles().catch((e) => setError(e instanceof Error ? e.message : '加载失败'))
  }, [])

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">简历 PDF</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            上传 PDF 源文件，前台 /resume 将在线预览并提供下载。
          </p>
        </div>
        <Link to="/resume" className="geek-btn-secondary text-sm">
          预览前台
        </Link>
      </div>

      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
      {message && <p className="text-sm text-[var(--color-accent)]">{message}</p>}

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">上传 PDF</h2>
        <p className="text-sm text-[var(--color-muted)]">上传新 PDF 后会自动设为当前版本。</p>
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
              setMessage('上传成功，刷新前台 /resume 即可预览。')
              await reloadFiles()
            } catch (err) {
              setError(err instanceof Error ? err.message : '上传失败')
            } finally {
              e.target.value = ''
            }
          }}
        />

        <div className="space-y-3">
          {files.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">暂无文件，请上传 PDF。</p>
          ) : (
            files.map((f) => (
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
                      setMessage('已切换当前版本')
                      await reloadFiles()
                    }}
                  >
                    设为当前
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

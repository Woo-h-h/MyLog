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
import type { ResumePageContent } from '../../types/resume'

const emptyContent = (): ResumePageContent => ({
  summary: '',
  education: [],
  awards: [],
  internships: [],
  projectSummaries: [],
  skills: [],
})

export function AdminResumePage() {
  const [files, setFiles] = useState<ResumeFileItem[]>([])
  const [content, setContent] = useState<ResumePageContent | null>(null)
  const [skillsText, setSkillsText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function reloadFiles() {
    setFiles(await fetchResumeFiles())
  }

  useEffect(() => {
    reloadFiles().catch((e) => setError(e instanceof Error ? e.message : '加载失败'))
    fetchAdminResumeContent()
      .then((data) => {
        setContent(data)
        setSkillsText((data.skills ?? []).join(', '))
      })
      .catch((e) => setError(e instanceof Error ? e.message : '加载页面内容失败'))
  }, [])

  async function onSaveContent(e: FormEvent) {
    e.preventDefault()
    if (!content) return
    setError(null)
    setMessage(null)
    try {
      await updateAdminResumeContent({
        ...content,
        skills: skillsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      })
      setMessage('页面内容已保存。刷新首页即可看到。')
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    }
  }

  if (!content && !error) return <p className="text-[var(--color-muted)]">加载中…</p>

  const data = content ?? emptyContent()

  return (
    <div className="max-w-3xl space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">简历</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            页面正文在下方编辑；PDF 源文件单独上传。荣誉奖项请前往{' '}
            <Link to="/admin/awards" className="text-[var(--color-accent)] hover:underline">
              荣誉奖项
            </Link>{' '}
            页面管理。
          </p>
        </div>
        <Link to="/#resume" className="geek-btn-secondary text-sm">
          预览前台
        </Link>
      </div>

      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
      {message && <p className="text-sm text-[var(--color-accent)]">{message}</p>}

      <form onSubmit={onSaveContent} className="space-y-6 border-b border-[var(--color-line)] pb-10">
        <h2 className="font-[family-name:var(--font-display)] text-xl">页面展示内容</h2>
        <label className="block space-y-1 text-sm">
          <span>简介</span>
          <textarea
            className="min-h-20 w-full geek-input"
            value={data.summary}
            onChange={(e) => setContent({ ...data, summary: e.target.value })}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>技能（逗号分隔）</span>
          <input className="geek-input" value={skillsText} onChange={(e) => setSkillsText(e.target.value)} />
        </label>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">教育经历</h3>
          {data.education.map((edu, i) => (
            <div key={i} className="space-y-2 rounded border border-[var(--color-line)] p-3">
              {(
                [
                  ['school', '学校'],
                  ['major', '专业'],
                  ['degree', '学位'],
                  ['period', '时间'],
                  ['college', '学院'],
                  ['gpa', 'GPA'],
                  ['honors', '荣誉'],
                ] as const
              ).map(([key, label]) => (
                <input
                  key={key}
                  className="geek-input"
                  placeholder={label}
                  value={edu[key] ?? ''}
                  onChange={(e) =>
                    setContent({
                      ...data,
                      education: data.education.map((item, j) =>
                        j === i ? { ...item, [key]: e.target.value } : item,
                      ),
                    })
                  }
                />
              ))}
            </div>
          ))}
          <button
            type="button"
            className="text-sm text-[var(--color-accent)]"
            onClick={() =>
              setContent({
                ...data,
                education: [...data.education, { school: '', major: '', degree: '', period: '' }],
              })
            }
          >
            + 添加教育经历
          </button>
        </div>

        <button type="submit" className="geek-btn-primary">
          保存页面内容
        </button>
      </form>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">PDF 源文件（下载用）</h2>
        <p className="text-sm text-[var(--color-muted)]">上传后前台「下载 PDF」将提供此文件，不在页面内嵌展示。</p>
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
          {files.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">暂无 PDF</p>
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
                      setMessage('已切换当前 PDF')
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

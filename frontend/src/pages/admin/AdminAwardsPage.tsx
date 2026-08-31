import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { fetchAdminResumeContent, updateAdminResumeContent } from '../../api/admin'
import type { ResumeAward, ResumePageContent } from '../../types/resume'

export function AdminAwardsPage() {
  const [content, setContent] = useState<ResumePageContent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchAdminResumeContent()
      .then(setContent)
      .catch((e) => setError(e instanceof Error ? e.message : '加载失败'))
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!content) return
    setError(null)
    setMessage(null)
    try {
      await updateAdminResumeContent({
        ...content,
        awards: (content.awards ?? []).filter((a) => a.title.trim() || a.date.trim()),
      })
      setMessage('已保存。刷新首页个人简介即可看到最新荣誉奖项。')
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    }
  }

  if (!content && !error) return <p className="text-[var(--color-muted)]">加载中…</p>

  const awards = content?.awards ?? []

  function updateAward(index: number, patch: Partial<ResumeAward>) {
    if (!content) return
    setContent({
      ...content,
      awards: awards.map((a, i) => (i === index ? { ...a, ...patch } : a)),
    })
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">荣誉奖项</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            编辑首页「个人简介」中教育经历下方的荣誉奖项列表。
          </p>
        </div>
        <Link to="/#resume" className="geek-btn-secondary text-sm">
          预览前台
        </Link>
      </div>

      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
      {message && <p className="text-sm text-[var(--color-accent)]">{message}</p>}

      <div className="space-y-3">
        {awards.length === 0 && (
          <p className="text-sm text-[var(--color-muted)]">暂无奖项，点击下方按钮添加。</p>
        )}
        {awards.map((award, i) => (
          <div key={i} className="space-y-2 rounded border border-[var(--color-line)] p-3">
            <div className="flex justify-between gap-2">
              <span className="text-xs text-[var(--color-muted)]">奖项 {i + 1}</span>
              <button
                type="button"
                className="text-xs text-[var(--color-error)]"
                onClick={() =>
                  setContent({
                    ...content!,
                    awards: awards.filter((_, j) => j !== i),
                  })
                }
              >
                删除
              </button>
            </div>
            <input
              className="geek-input"
              placeholder="日期，如 2024 年 5 月"
              value={award.date}
              onChange={(e) => updateAward(i, { date: e.target.value })}
            />
            <input
              className="geek-input"
              placeholder="奖项名称"
              value={award.title}
              onChange={(e) => updateAward(i, { title: e.target.value })}
            />
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-[var(--color-accent)]"
          onClick={() =>
            setContent({
              ...content!,
              awards: [...awards, { date: '', title: '' }],
            })
          }
        >
          + 添加奖项
        </button>
      </div>

      <button type="submit" className="geek-btn-primary">
        保存
      </button>
    </form>
  )
}

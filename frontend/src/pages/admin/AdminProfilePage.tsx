import { useEffect, useState, type FormEvent } from 'react'
import { fetchAdminProfile, updateAdminProfile } from '../../api/admin'
import type { Profile } from '../../types/profile'

export function AdminProfilePage() {
  const [form, setForm] = useState<Profile | null>(null)
  const [skillsText, setSkillsText] = useState('')
  const [highlightsText, setHighlightsText] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAdminProfile()
      .then((p) => {
        setForm(p)
        setSkillsText((p.skills ?? []).join(', '))
        setHighlightsText((p.highlights ?? []).join('\n'))
      })
      .catch((e) => setError(e instanceof Error ? e.message : '加载失败'))
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form) return
    setMessage(null)
    setError(null)
    try {
      const updated = await updateAdminProfile({
        ...form,
        skills: skillsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        highlights: highlightsText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      })
      setForm(updated)
      setMessage('已保存。打开前台首页可看到最新定位语。')
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    }
  }

  if (!form && !error) return <p className="text-[var(--color-muted)]">加载中…</p>
  if (!form) return <p className="text-[var(--color-error)]">{error}</p>

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">个人资料</h1>
      {(
        [
          ['displayName', '显示名'],
          ['tagline', '一句话定位'],
          ['subtitle', '副标题'],
          ['email', '邮箱'],
          ['phone', '手机'],
          ['githubUrl', 'GitHub'],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block space-y-1 text-sm">
          <span>{label}</span>
          <input
            className="geek-input"
            value={(form[key] as string) ?? ''}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </label>
      ))}
      <label className="block space-y-1 text-sm">
        <span>简介</span>
        <textarea
          className="min-h-24 geek-input"
          value={form.bio ?? ''}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>技能（逗号分隔）</span>
        <input
          className="geek-input"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>亮点（每行一条）</span>
        <textarea
          className="min-h-24 geek-input"
          value={highlightsText}
          onChange={(e) => setHighlightsText(e.target.value)}
        />
      </label>
      {message && <p className="text-sm text-[var(--color-accent)]">{message}</p>}
      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
      <button type="submit" className="geek-btn-primary px-4 py-2">
        保存
      </button>
    </form>
  )
}

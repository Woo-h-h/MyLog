import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { fetchAdminStudentWork, updateAdminStudentWork } from '../../api/admin'
import type { StudentWorkData, StudentWorkExperience, StudentWorkRole } from '../../types/studentWork'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 border-t border-[var(--color-line)] pt-6">
      <h2 className="font-[family-name:var(--font-display)] text-lg">{title}</h2>
      {children}
    </section>
  )
}

export function AdminStudentWorkPage() {
  const [form, setForm] = useState<StudentWorkData | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAdminStudentWork()
      .then(setForm)
      .catch((e) => setError(e instanceof Error ? e.message : '加载失败'))
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form) return
    setMessage(null)
    setError(null)
    try {
      const updated = await updateAdminStudentWork(form)
      setForm(updated)
      setMessage('已保存。刷新前台 /student-work 即可看到最新内容。')
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    }
  }

  if (!form && !error) return <p className="text-[var(--color-muted)]">加载中…</p>
  if (!form) return <p className="text-[var(--color-error)]">{error}</p>

  const data = form

  function updateRole(index: number, patch: Partial<StudentWorkRole>) {
    setForm({
      ...data,
      roles: data.roles.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    })
  }

  function updateTimeline(index: number, patch: Partial<StudentWorkExperience>) {
    setForm({
      ...data,
      timeline: data.timeline.map((t, i) => (i === index ? { ...t, ...patch } : t)),
    })
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">学生工作</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">编辑前台 /student-work 页面全部内容。</p>
        </div>
        <Link to="/student-work" className="geek-btn-secondary text-sm">
          预览前台
        </Link>
      </div>

      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
      {message && <p className="text-sm text-[var(--color-accent)]">{message}</p>}

      <Section title="页面标题">
        <label className="block space-y-1 text-sm">
          <span>标题</span>
          <input
            className="geek-input"
            value={data.meta.title}
            onChange={(e) => setForm({ ...data, meta: { ...data.meta, title: e.target.value } })}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>副标题</span>
          <textarea
            className="min-h-20 geek-input"
            value={data.meta.subtitle}
            onChange={(e) => setForm({ ...form, meta: { ...data.meta, subtitle: e.target.value } })}
          />
        </label>
      </Section>

      <Section title="曾任职务">
        {data.roles.map((role, i) => (
          <div key={i} className="space-y-2 rounded border border-[var(--color-line)] p-3">
            <div className="flex justify-between gap-2">
              <span className="text-xs text-[var(--color-muted)]">职务 {i + 1}</span>
              <button
                type="button"
                className="text-xs text-[var(--color-error)]"
                onClick={() => setForm({ ...form, roles: data.roles.filter((_, j) => j !== i) })}
              >
                删除
              </button>
            </div>
            <input
              className="geek-input"
              placeholder="职务名称"
              value={role.title}
              onChange={(e) => updateRole(i, { title: e.target.value })}
            />
            <input
              className="geek-input"
              placeholder="组织"
              value={role.org}
              onChange={(e) => updateRole(i, { org: e.target.value })}
            />
            <input
              className="geek-input"
              placeholder="任期（可选）"
              value={role.period ?? ''}
              onChange={(e) => updateRole(i, { period: e.target.value || undefined })}
            />
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-[var(--color-accent)]"
          onClick={() => setForm({ ...form, roles: [...data.roles, { title: '', org: '' }] })}
        >
          + 添加职务
        </button>
      </Section>

      <Section title="工作经历">
        {data.timeline.map((item, i) => (
          <div key={i} className="flex flex-wrap gap-2">
            <input
              className="geek-input flex-1"
              placeholder="日期"
              value={item.date}
              onChange={(e) => updateTimeline(i, { date: e.target.value })}
            />
            <input
              className="geek-input min-w-[12rem] flex-[2]"
              placeholder="事件"
              value={item.title}
              onChange={(e) => updateTimeline(i, { title: e.target.value })}
            />
            <button
              type="button"
              className="text-xs text-[var(--color-error)]"
              onClick={() => setForm({ ...form, timeline: data.timeline.filter((_, j) => j !== i) })}
            >
              删
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-[var(--color-accent)]"
          onClick={() => setForm({ ...form, timeline: [...data.timeline, { date: '', title: '' }] })}
        >
          + 添加时间线
        </button>
      </Section>

      <button type="submit" className="geek-btn-primary">
        保存
      </button>
    </form>
  )
}

import { useEffect, useState } from 'react'
import { fetchStudentWork } from '../api/content'
import { AdminEditLink } from '../components/AdminEditLink'
import { LoadingState } from '../components/UiStates'
import { StudentWorkView } from '../components/StudentWorkView'
import { defaultStudentWork } from '../types/studentWork'
import type { StudentWorkData } from '../types/studentWork'

export function StudentWorkPage() {
  const [data, setData] = useState<StudentWorkData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchStudentWork()
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : '加载失败')
          setData(defaultStudentWork)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <LoadingState />
  if (!data) {
    return <div className="alert-error">无法加载学生工作：{error ?? '未知错误'}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AdminEditLink to="/admin/student-work" />
      </div>
      {error && <p className="text-sm text-[var(--color-muted)]">使用本地默认内容展示（{error}）</p>}
      <StudentWorkView data={data} />
    </div>
  )
}

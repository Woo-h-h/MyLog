import type { StudentWorkData } from '../types/studentWork'
import { PageHero } from './PageHero'

export function StudentWorkView({ data }: { data: StudentWorkData }) {
  const { meta } = data
  return (
    <div className="space-y-12">
      <PageHero label="Student Work" title={meta.title} description={meta.subtitle} />

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)]">曾任职务</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {data.roles.map((role) => (
            <div
              key={`${role.title}-${role.org}`}
              className="border-l-2 border-[var(--color-link-blue)] pl-4"
            >
              <p className="font-medium text-[var(--color-ink)]">{role.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">{role.org}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)]">工作经历</h2>
        <ul className="space-y-3">
          {data.timeline.map((item) => (
            <li
              key={`${item.date}-${item.title}`}
              className="geek-card flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-4"
            >
              <span className="shrink-0 text-xs text-[var(--color-link-blue)]">{item.date}</span>
              <span className="text-sm text-[var(--color-muted)]">{item.title}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

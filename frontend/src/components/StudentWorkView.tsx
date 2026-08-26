import type { StudentWorkData } from '../types/studentWork'

export function StudentWorkView({ data }: { data: StudentWorkData }) {
  const { meta } = data
  return (
    <div className="space-y-12">
      <div className="gradient-hero space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-link-blue)]">Student Work</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--color-ink)]">
          {meta.title}
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-[var(--color-muted)]">{meta.subtitle}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="geek-tag text-xs">优秀共青团干部申报</span>
          <span className="geek-tag text-xs">通信工程 2303</span>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)]">现任职务</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.roles.map((role) => (
            <article key={`${role.title}-${role.org}`} className="geek-card p-5">
              <h3 className="font-medium text-[var(--color-ink)]">{role.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{role.org}</p>
              {role.period && <p className="mt-1 text-xs text-[var(--color-link-blue)]">{role.period}</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)]">综合情况</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['志愿汇注册', meta.volunteer.registered ? '是' : '否'],
            ['2024 志愿服务时长', meta.volunteer.hours2024],
            ['2024 教育评议', meta.volunteer.leagueReview2024],
            ['专业成绩排名', meta.volunteer.rankPercent],
          ].map(([label, value]) => (
            <div key={label} className="geek-card px-4 py-3">
              <p className="text-xs text-[var(--color-muted)]">{label}</p>
              <p className="mt-1 text-sm font-medium text-[var(--color-ink)]">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)]">调研部工作经历</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-[var(--color-muted)]">{data.experienceIntro}</p>
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

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)]">其他工作</h2>
        <div className="space-y-4">
          {data.story.map((item) => (
            <article key={item.heading} className="geek-card p-5">
              <h3 className="text-sm font-medium text-[var(--color-link-blue)]">{item.heading}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)]">团干部工作经历</h2>
        <ul className="space-y-3">
          {data.leagueHistory.map((item) => (
            <li key={item.role} className="geek-card flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-4">
              <span className="text-xs text-[var(--color-link-blue)]">{item.period}</span>
              <span className="text-sm text-[var(--color-muted)]">{item.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)]">相关获奖</h2>
        <ul className="space-y-3">
          {data.awards.map((award) => (
            <li key={award.title} className="geek-card flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-4">
              <span className="shrink-0 text-xs text-[var(--color-link-blue)]">{award.date}</span>
              <span className="text-sm text-[var(--color-muted)]">{award.title}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

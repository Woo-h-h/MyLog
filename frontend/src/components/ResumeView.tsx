import type { ResumeData } from '../types/resume'

export function ResumeView({ resume }: { resume: ResumeData }) {
  return (
    <div className="space-y-10">
      <p className="max-w-2xl text-[var(--color-muted)]">{resume.summary}</p>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">教育经历</h2>
        {resume.education.map((edu) => (
          <div key={edu.school + edu.period} className="border-t border-[var(--color-line)] pt-4">
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="font-medium">
                {edu.school} · {edu.major}
              </h3>
              <span className="text-sm text-[var(--color-muted)]">{edu.period}</span>
            </div>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {[edu.college, edu.degree, edu.gpa].filter(Boolean).join(' · ')}
            </p>
            {edu.honors && !resume.awards?.length && (
              <p className="mt-2 text-sm leading-relaxed">{edu.honors}</p>
            )}
          </div>
        ))}
      </section>

      {(resume.awards?.length ?? 0) > 0 && (
        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-xl">荣誉奖项</h2>
          <ul className="space-y-3">
            {resume.awards.map((award) => (
              <li
                key={`${award.date}-${award.title}`}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-[var(--color-line)] pt-4"
              >
                <span className="shrink-0 text-xs text-[var(--color-link-blue)]">{award.date}</span>
                <span className="text-sm text-[var(--color-muted)]">{award.title}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">实习经历</h2>
        {resume.internships.map((item) => (
          <div key={item.company + item.period} className="border-t border-[var(--color-line)] pt-4">
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="font-medium">
                {item.company} · {item.role}
              </h3>
              <span className="text-sm text-[var(--color-muted)]">{item.period}</span>
            </div>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {[item.location, item.project].filter(Boolean).join(' · ')}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              {item.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">项目经历</h2>
        {resume.projectSummaries.map((p) => (
          <div key={p.name} className="border-t border-[var(--color-line)] pt-4">
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="font-medium">{p.name}</h3>
              <span className="text-sm text-[var(--color-muted)]">{p.period}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{p.oneLiner}</p>
            {p.githubUrl && (
              <a
                className="mt-2 inline-block text-sm text-[var(--color-accent)] hover:underline"
                href={p.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            )}
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl">技术栈</h2>
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((s) => (
            <span key={s} className="geek-tag text-sm">
              {s}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}

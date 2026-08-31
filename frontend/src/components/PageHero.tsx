type PageHeroProps = {
  label: string
  title: string
  description?: string
}

export function PageHero({ label, title, description }: PageHeroProps) {
  return (
    <div className="gradient-hero gradient-hero-page space-y-3">
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-link-blue)]">{label}</p>
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--color-ink)]">
        {title}
      </h1>
      {description && (
        <p className="line-clamp-2 text-base leading-relaxed text-[var(--color-muted)]">{description}</p>
      )}
    </div>
  )
}

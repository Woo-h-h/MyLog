export function PlaceholderPage({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="space-y-3">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">{title}</h1>
      <p className="text-[var(--color-muted)]">{hint}</p>
    </div>
  )
}

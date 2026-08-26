export function LoadingState({ label = '加载中…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-8 text-[var(--color-muted)]" role="status">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-line)] border-t-[var(--color-link-blue)]" />
      <span>{label}</span>
    </div>
  )
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="geek-card border-dashed px-5 py-10 text-center">
      <p className="font-medium">{title}</p>
      {hint && <p className="mt-2 text-sm text-[var(--color-muted)]">{hint}</p>}
    </div>
  )
}

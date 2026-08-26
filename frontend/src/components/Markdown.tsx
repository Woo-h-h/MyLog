import ReactMarkdown from 'react-markdown'

export function Markdown({ content }: { content: string }) {
  return (
    <div className="markdown space-y-3 text-[15px] leading-7 text-[var(--color-ink)]/90 [&_code]:rounded [&_code]:bg-[var(--color-accent-dim)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-[var(--color-link-blue)] [&_h2]:mt-6 [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-xl [&_h2]:text-[var(--color-ink)] [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:text-[var(--color-ink)] [&_li]:ml-5 [&_li]:list-disc [&_p]:text-[var(--color-muted)] [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-[var(--color-line)] [&_pre]:bg-[var(--color-surface)] [&_pre]:p-4 [&_strong]:text-[var(--color-ink)] [&_ul]:space-y-1">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}

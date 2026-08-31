import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

function resolveAssetUrl(src: string | undefined, assetBaseUrl?: string) {
  if (!src || !assetBaseUrl) return src
  if (/^(https?:|data:|mailto:|#|\/\/)/i.test(src)) return src
  try {
    return new URL(src.replace(/^\.\//, ''), assetBaseUrl).href
  } catch {
    return src
  }
}

export function Markdown({
  content,
  assetBaseUrl,
}: {
  content: string
  assetBaseUrl?: string
}) {
  const components: Components = {
    img: ({ src, alt, ...props }) => (
      <img {...props} src={resolveAssetUrl(src, assetBaseUrl)} alt={alt ?? ''} loading="lazy" />
    ),
    a: ({ href, children, ...props }) => (
      <a
        {...props}
        href={resolveAssetUrl(href, assetBaseUrl) ?? href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  }

  return (
    <div className="markdown max-w-3xl space-y-3 text-[15px] leading-7 text-[var(--color-ink)]/90 [&_a]:text-[var(--color-accent)] [&_a]:underline-offset-2 hover:[&_a]:underline [&_code]:rounded [&_code]:bg-[var(--color-accent-dim)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-[var(--color-link-blue)] [&_h1]:mt-2 [&_h1]:font-[family-name:var(--font-display)] [&_h1]:text-2xl [&_h1]:text-[var(--color-ink)] [&_h2]:mt-6 [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-xl [&_h2]:text-[var(--color-ink)] [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:text-[var(--color-ink)] [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-lg [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:text-[var(--color-muted)] [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-[var(--color-line)] [&_pre]:bg-[var(--color-surface)] [&_pre]:p-4 [&_strong]:text-[var(--color-ink)] [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-[var(--color-line)] [&_td]:px-3 [&_td]:py-2 [&_td]:text-[var(--color-muted)] [&_th]:border [&_th]:border-[var(--color-line)] [&_th]:bg-[var(--color-surface)] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-medium [&_th]:text-[var(--color-ink)] [&_ul]:space-y-1">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

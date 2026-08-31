import { useEffect } from 'react'

export function PageMeta({ title, description }: { title: string; description?: string }) {
  useEffect(() => {
    document.title = title
    const desc = description ?? '个人作品集网站：项目、博客、笔记与在线简历。'
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', desc)
  }, [title, description])

  return null
}

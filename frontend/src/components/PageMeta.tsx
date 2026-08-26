import { useEffect } from 'react'

export function PageMeta({ title, description }: { title: string; description?: string }) {
  useEffect(() => {
    document.title = title
    const desc = description ?? '王焕的个人网站｜Java 后端｜RAG / Agent 工程化｜湖南大学'
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

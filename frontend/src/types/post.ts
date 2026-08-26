import type { ApiResponse } from './profile'

export interface PostSummary {
  slug: string
  title: string
  summary?: string | null
  type: 'blog' | 'note' | string
  publishedAt?: string | null
  tags: string[]
}

export interface PostDetail extends PostSummary {
  content: string
}

export interface PageResult<T> {
  items: T[]
  page: number
  size: number
  total: number
  totalPages: number
}

export interface TagItem {
  name: string
  slug: string
}

export type { ApiResponse }

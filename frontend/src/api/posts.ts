import { api, getData } from './client'
import type { PageResult, PostDetail, PostSummary, TagItem } from '../types/post'

export function fetchPosts(params: {
  type: 'blog' | 'note'
  tag?: string
  page?: number
  size?: number
}) {
  return getData<PageResult<PostSummary>>(
    api.get('/posts', {
      params: {
        type: params.type,
        tag: params.tag,
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    }),
  )
}

export function fetchPost(slug: string) {
  return getData<PostDetail>(api.get(`/posts/${slug}`))
}

export function fetchTags() {
  return getData<TagItem[]>(api.get('/tags'))
}

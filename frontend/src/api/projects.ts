import { api, getData } from './client'
import type { ProjectDetail, ProjectSummary } from '../types/profile'

export function fetchProjects(featured?: boolean) {
  return getData<ProjectSummary[]>(
    api.get('/projects', { params: featured === undefined ? {} : { featured } }),
  )
}

export function fetchProject(slug: string) {
  return getData<ProjectDetail>(api.get(`/projects/${slug}`))
}

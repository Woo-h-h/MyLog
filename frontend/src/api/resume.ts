import { api, getData } from './client'
import type { ResumeInfo } from '../types/profile'

export function fetchResume() {
  return getData<ResumeInfo>(api.get('/resume'))
}

export function resumeViewUrl() {
  return '/api/resume/view'
}

export function resumeDownloadUrl() {
  return '/api/resume/download'
}

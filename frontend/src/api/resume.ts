import { api, getData } from './client'
import type { ResumeData } from '../types/profile'

export function fetchResume() {
  return getData<ResumeData>(api.get('/resume'))
}

/** Use same-origin proxy path so download works in dev */
export function resumeDownloadUrl() {
  return '/api/resume/download'
}

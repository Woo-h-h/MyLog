import { api, getData } from './client'
import type { ResumeData } from '../types/resume'

export function fetchResume() {
  return getData<ResumeData>(api.get('/resume'))
}

export function resumeDownloadUrl() {
  return '/api/resume/download'
}

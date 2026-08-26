import { api, getData } from './client'
import type { Profile } from '../types/profile'

export function login(username: string, password: string) {
  return getData<{ token: string; username: string }>(
    api.post('/auth/login', { username, password }),
  )
}

export function fetchAdminProfile() {
  return getData<Profile>(api.get('/admin/profile'))
}

export function updateAdminProfile(payload: Partial<Profile> & { skills?: string[]; highlights?: string[] }) {
  return getData<Profile>(api.put('/admin/profile', payload))
}

export interface AdminProject {
  id: number
  slug: string
  title: string
  summary: string
  content?: string
  techStack?: string
  githubUrl?: string | null
  demoUrl?: string | null
  startDate?: string | null
  endDate?: string | null
  sortOrder?: number
  featured?: boolean
  published?: boolean
}

export function fetchAdminProjects() {
  return getData<AdminProject[]>(api.get('/admin/projects'))
}

export function createAdminProject(payload: Partial<AdminProject>) {
  return getData<AdminProject>(api.post('/admin/projects', payload))
}

export function updateAdminProject(id: number, payload: Partial<AdminProject>) {
  return getData<AdminProject>(api.put(`/admin/projects/${id}`, payload))
}

export function deleteAdminProject(id: number) {
  return getData<null>(api.delete(`/admin/projects/${id}`))
}

export interface AdminPost {
  id: number
  slug: string
  title: string
  summary?: string
  content: string
  type: string
  status: string
  publishedAt?: string
  tags: string[]
}

export function fetchAdminPosts() {
  return getData<AdminPost[]>(api.get('/admin/posts'))
}

export function createAdminPost(payload: Partial<AdminPost>) {
  return getData<AdminPost>(api.post('/admin/posts', payload))
}

export function updateAdminPost(id: number, payload: Partial<AdminPost>) {
  return getData<AdminPost>(api.put(`/admin/posts/${id}`, payload))
}

export function deleteAdminPost(id: number) {
  return getData<null>(api.delete(`/admin/posts/${id}`))
}

export interface ResumeFileItem {
  id: number
  originalFilename: string
  currentVersion: boolean
  uploadedAt: string
}

export function fetchResumeFiles() {
  return getData<ResumeFileItem[]>(api.get('/admin/resume/files'))
}

export async function uploadResume(file: File) {
  const form = new FormData()
  form.append('file', file)
  return getData<ResumeFileItem>(api.post('/admin/resume/upload', form))
}

export function setCurrentResume(id: number) {
  return getData<ResumeFileItem>(api.put(`/admin/resume/files/${id}/current`))
}

export function fetchAdminStudentWork() {
  return getData<import('../types/studentWork').StudentWorkData>(api.get('/admin/content/student-work'))
}

export function updateAdminStudentWork(payload: import('../types/studentWork').StudentWorkData) {
  return getData<import('../types/studentWork').StudentWorkData>(
    api.put('/admin/content/student-work', payload),
  )
}

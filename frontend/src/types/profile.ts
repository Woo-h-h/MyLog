export interface Profile {
  displayName: string
  tagline: string
  subtitle?: string | null
  bio?: string | null
  phone?: string | null
  email?: string | null
  githubUrl?: string | null
  skills: string[]
  highlights?: string[]
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface ProjectSummary {
  slug: string
  title: string
  summary: string
  techStack: string[]
  startDate?: string | null
  endDate?: string | null
  featured: boolean
  githubUrl?: string | null
}

export interface ProjectDetail extends ProjectSummary {
  content: string
  githubUrl?: string | null
  demoUrl?: string | null
}

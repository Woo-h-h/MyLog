export interface ResumeEducation {
  school: string
  college?: string
  major: string
  degree: string
  period: string
  gpa?: string
  honors?: string
}

export interface ResumeInternship {
  company: string
  role: string
  period: string
  location?: string
  project?: string
  highlights: string[]
}

export interface ResumeProjectSummary {
  name: string
  period: string
  oneLiner: string
  githubUrl?: string | null
}

export interface ResumeAward {
  date: string
  title: string
}

export interface ResumeData {
  summary: string
  education: ResumeEducation[]
  awards: ResumeAward[]
  internships: ResumeInternship[]
  projectSummaries: ResumeProjectSummary[]
  skills: string[]
  pdfAvailable: boolean
  filename?: string | null
  uploadedAt?: string | null
}

export type ResumePageContent = Omit<ResumeData, 'pdfAvailable' | 'filename' | 'uploadedAt'>

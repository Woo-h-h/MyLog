export type StudentWorkRole = {
  title: string
  org: string
  period?: string
}

export type StudentWorkAward = {
  date: string
  title: string
}

export type StudentWorkExperience = {
  date: string
  title: string
}

export type StudentWorkStory = {
  heading: string
  body: string
}

export type StudentWorkLeagueItem = {
  period: string
  role: string
}

export type StudentWorkData = {
  meta: {
    title: string
    subtitle: string
    volunteer: {
      registered: boolean
      hours2024: string
      leagueReview2024: string
      rankPercent: string
    }
  }
  roles: StudentWorkRole[]
  experienceIntro: string
  timeline: StudentWorkExperience[]
  story: StudentWorkStory[]
  leagueHistory: StudentWorkLeagueItem[]
  awards: StudentWorkAward[]
}

/** Empty skeleton — real content comes from the database via API. */
export const emptyStudentWork: StudentWorkData = {
  meta: {
    title: '学生工作',
    subtitle: '',
    volunteer: {
      registered: false,
      hours2024: '',
      leagueReview2024: '',
      rankPercent: '',
    },
  },
  roles: [],
  experienceIntro: '',
  timeline: [],
  story: [],
  leagueHistory: [],
  awards: [],
}

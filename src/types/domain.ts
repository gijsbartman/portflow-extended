import type { ApiLevel } from "./api"

export interface Goal {
  id: number
  nickname: string
  name: string
  status: string
}

export interface FeedbackItem {
  id: number
  role: string
  isExternal: boolean
  score: number | null
  levelId: string | null
  date: Date
  reviewerName: string
  reviewRequestTitle: string
  hasValidScore: boolean
  levelSet: ApiLevel[]
}

export interface EvalCounts {
  valid: number
  invalid: number
  total: number
}

export interface GoalSummary {
  goal: Goal
  recentLevel: string | null
  highestLevel: string | null
  evalCounts: EvalCounts
  levelSet: ApiLevel[]
}

export interface GoalWithFeedback {
  goal: Goal
  feedback: FeedbackItem[] | null
  levelSet: ApiLevel[]
  error?: string
}

export interface FeedbackCompleteEvent {
  portfolioId: string
  results: GoalWithFeedback[]
  summaries: GoalSummary[]
}

type SkillLevel = 0 | 1 | 2 | 3 | 4

export type SkillLevels = {
  [K in SkillLevel as `level_${K}`]?: number
}

export interface Course {
  year: number
  semester: number
  course: string
  skills_general: SkillLevels
  kpm_level: number | null
  hboi: SkillLevels | null
}

export interface ApiLevel {
  id: string
  label: string
  score: number
  translations?: {
    en?: string
  }
}

export interface ApiReviewer {
  id: number
  name: string
  user_type: string
  current_role: string
  profile_picture_url?: string
}

export interface ApiEvaluation {
  id: number
  score: number | null
  level: string | null
  comment: string
  review_request_title: string
  review_request_id: number
  review_request_scored: boolean
  submitted_at: string
  level_set: ApiLevel[]
  reviewer: ApiReviewer
}

export interface ApiFeedbackItem {
  id: number
  resource_id: number
  resource_type: string
  type: string
  role: string
  date: string
  evaluation: ApiEvaluation
}

export interface ApiGoal {
  id: number
  nickname: string
  name: string
  status: string
  description?: string
  position?: number
}

export type ApiGoalsResponse = ApiGoal[]

export interface ApiFeedbackResponse {
  data?: ApiFeedbackItem[]
}

import type { ApiFeedbackItem, EvalCounts, FeedbackItem } from "../types"
import { getLevelLabel, sortByDateDesc } from "../utils/level.utils"

export const FeedbackService = {
  processItem: (apiItem: ApiFeedbackItem): FeedbackItem => {
    const isExternal = apiItem.role !== "self"
    const score = apiItem.evaluation.score

    return {
      id: apiItem.id,
      role: apiItem.role,
      isExternal,
      score: score,
      levelId: apiItem.evaluation.level,
      date: new Date(apiItem.date || apiItem.evaluation.submitted_at),
      reviewerName: apiItem.evaluation.reviewer.name,
      reviewRequestTitle: apiItem.evaluation.review_request_title,
      hasValidScore: score !== null && score !== undefined,
      levelSet: apiItem.evaluation.level_set || [],
    }
  },

  processItems: (apiItems: ApiFeedbackItem[]): FeedbackItem[] => {
    return apiItems.map(FeedbackService.processItem)
  },

  getMostRecentExternalLevel: (items: FeedbackItem[]): string => {
    const externalEvaluations = items.filter((i) => i.isExternal && i.hasValidScore)
    const sorted = sortByDateDesc(externalEvaluations)
    const mostRecent = sorted[0]

    return mostRecent ? getLevelLabel(mostRecent.score, mostRecent.levelSet) : "-"
  },

  getHighestExternalLevel: (items: FeedbackItem[]): string => {
    const externalEvaluations = items.filter((i) => i.isExternal && i.hasValidScore)

    if (externalEvaluations.length === 0) return "-"

    const highest = externalEvaluations.reduce((max, curr) => {
      const currScore = curr.score || 0
      const maxScore = max.score || 0
      return currScore > maxScore ? curr : max
    })

    return getLevelLabel(highest.score, highest.levelSet)
  },

  getEvalCounts: (items: FeedbackItem[]): EvalCounts => {
    const externalEvals = items.filter((i) => i.isExternal)

    const valid = externalEvals.filter((i) => i.hasValidScore).length
    const invalid = externalEvals.length - valid

    return {
      valid,
      invalid,
      total: externalEvals.length,
    }
  },

  formatEvalCount: (counts: EvalCounts): string => {
    if (counts.invalid > 0) {
      return `${counts.valid} (${counts.invalid})`
    }
    return `${counts.valid}`
  },
}

import { CONFIG } from "../constants/config"
import type { ApiGoal, Goal, GoalSummary, GoalWithFeedback } from "../types"
import { FeedbackService } from "./feedback.service"

export const GoalsService = {
  filterTargetGoals: (goals: ApiGoal[]): ApiGoal[] => {
    return goals.filter((g) => CONFIG.TARGET_STATUSES.includes(g.status))
  },

  processGoal: (apiGoal: ApiGoal): Goal => ({
    id: apiGoal.id,
    nickname: apiGoal.nickname,
    name: apiGoal.name,
    status: apiGoal.status,
  }),

  createSummary: (result: GoalWithFeedback): GoalSummary => {
    const { goal, feedback, levelSet } = result

    if (!feedback || feedback.length === 0) {
      return {
        goal,
        recentLevel: "-",
        highestLevel: "-",
        evalCounts: { valid: 0, invalid: 0, total: 0 },
        levelSet: levelSet || [],
      }
    }

    const evalCounts = FeedbackService.getEvalCounts(feedback)
    const recentLevel = FeedbackService.getMostRecentExternalLevel(feedback)
    const highestLevel = FeedbackService.getHighestExternalLevel(feedback)

    return {
      goal,
      recentLevel,
      highestLevel,
      evalCounts,
      levelSet,
    }
  },

  generateTableData: (summaries: GoalSummary[]) => {
    return summaries.map((s) => ({
      Goal: s.goal.nickname,
      Name: s.goal.name.length > 40 ? s.goal.name.substring(0, 40) + "..." : s.goal.name,
      "Recent Level": s.recentLevel,
      "Highest Level": s.highestLevel,
      "# Evals": FeedbackService.formatEvalCount(s.evalCounts),
    }))
  },
}

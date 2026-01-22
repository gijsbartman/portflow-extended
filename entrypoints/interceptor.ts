import { CONFIG } from "../src/constants/config"
import { FeedbackService } from "../src/services/feedback.service"
import { GoalsService } from "../src/services/goals.service"
import type {
  ApiFeedbackItem,
  ApiFeedbackResponse,
  ApiGoalsResponse,
  ApiLevel,
  GoalWithFeedback,
} from "../src/types"
import { logger } from "../src/utils/logger"

export default defineUnlistedScript(() => {
  if ((window as any).__portflowInterceptorInstalled) return
  ;(window as any).__portflowInterceptorInstalled = true

  logger.success("Fetch interceptor installed")

  const originalFetch = window.fetch

  // Store captured auth headers
  let capturedHeaders: Record<string, string> = {}

  // Helper to check if URL is a Portflow API call
  const isPortflowApi = (url: string) =>
    url.includes("portfolio.drieam.app/api/") || url.startsWith("/api/v1/")

  window.fetch = async function (...args) {
    const url = typeof args[0] === "string" ? args[0] : (args[0] as Request)?.url || ""
    const options = args[1] as RequestInit | undefined

    if (isPortflowApi(url)) {
      if (options?.headers) {
        const headers = options.headers
        if (headers instanceof Headers) {
          headers.forEach((value, key) => {
            capturedHeaders[key] = value
          })
        } else if (Array.isArray(headers)) {
          Object.assign(capturedHeaders, Object.fromEntries(headers))
        } else {
          Object.assign(capturedHeaders, headers)
        }
      }
    }

    const response = await originalFetch.apply(this, args)

    if (CONFIG.API.GOALS_PATTERN.test(url)) {
      try {
        const clonedResponse = response.clone()
        const data: ApiGoalsResponse = await clonedResponse.json()

        const match = url.match(CONFIG.API.PORTFOLIO_ID_REGEX)
        const portfolioId = match ? match[1] : null

        logger.info("Intercepted goals API", { portfolioId, count: data.length })

        if (portfolioId && data.length > 0) {
          const targetGoals = GoalsService.filterTargetGoals(data)

          if (targetGoals.length > 0) {
            logger.info(`Fetching feedback for ${targetGoals.length} goals...`)

            const results = await Promise.all(
              targetGoals.map(async (apiGoal): Promise<GoalWithFeedback> => {
                const goal = GoalsService.processGoal(apiGoal)
                try {
                  const feedbackUrl = CONFIG.API.FEEDBACK_ENDPOINT(portfolioId, goal.id)

                  const res = await originalFetch(feedbackUrl, {
                    method: "GET",
                    headers: capturedHeaders,
                    credentials: "include",
                  })

                  if (!res.ok) {
                    logger.error(`Failed to fetch ${goal.nickname}: ${res.status}`)
                    return { goal, feedback: null, levelSet: [], error: res.statusText }
                  }

                  const json: ApiFeedbackResponse | ApiFeedbackItem[] = await res.json()
                  const rawItems = Array.isArray(json) ? json : json.data || []

                  const feedback = FeedbackService.processItems(rawItems)

                  // Level set is usually on the first evaluation
                  const levelSet: ApiLevel[] = (rawItems[0] as any)?.evaluation?.level_set || []

                  logger.success(`Fetched ${goal.nickname}: ${feedback.length} items`)

                  return { goal, feedback, levelSet }
                } catch (e) {
                  logger.error(`Error fetching ${goal.nickname}:`, e)
                  return { goal, feedback: null, levelSet: [], error: String(e) }
                }
              })
            )

            const summaries = results.map(GoalsService.createSummary)

            const tableData = GoalsService.generateTableData(summaries)
            logger.table("Goal Summaries", tableData)

            window.dispatchEvent(
              new CustomEvent(CONFIG.EVENTS.FEEDBACK_COMPLETE, {
                detail: { portfolioId, results, summaries },
              })
            )
          }
        }
      } catch (e) {
        logger.error("Error processing interceptor logic:", e)
      }
    }

    return response
  }
})

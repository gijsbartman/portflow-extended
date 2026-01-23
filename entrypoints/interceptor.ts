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

// Extend Window interface for type safety
declare global {
  interface Window {
    __portflowInterceptorInstalled?: boolean
  }
}

export default defineUnlistedScript(() => {
  if (window.__portflowInterceptorInstalled) return
  window.__portflowInterceptorInstalled = true

  logger.success("Fetch interceptor installed")

  const originalFetch = window.fetch

  // Helper to check if URL is a Portflow API call
  const isPortflowApi = (url: string) =>
    url.includes("portfolio.drieam.app/api/") || url.startsWith("/api/v1/")

  // Helper to safely extract headers from various header types
  const extractHeaders = (headers: HeadersInit | undefined): Record<string, string> => {
    const extracted: Record<string, string> = {}
    if (!headers) return extracted

    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        extracted[key] = value
      })
    } else if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        extracted[key] = value
      })
    } else {
      Object.assign(extracted, headers)
    }
    return extracted
  }

  // Type guard for API goal validation
  const isValidGoal = (goal: unknown): goal is ApiGoalsResponse[number] => {
    if (!goal || typeof goal !== "object") return false
    const g = goal as Record<string, unknown>
    return (
      typeof g.id === "number" &&
      typeof g.nickname === "string" &&
      typeof g.name === "string" &&
      typeof g.status === "string"
    )
  }

  // Type guard for feedback item validation
  const isValidFeedbackItem = (item: unknown): item is ApiFeedbackItem => {
    if (!item || typeof item !== "object") return false
    const f = item as Record<string, unknown>
    return (
      typeof f.id === "number" &&
      typeof f.role === "string" &&
      f.evaluation !== null &&
      typeof f.evaluation === "object"
    )
  }

  // Safe extraction of level set from feedback items
  const extractLevelSet = (items: ApiFeedbackItem[]): ApiLevel[] => {
    const firstItem = items[0]
    if (!firstItem?.evaluation) return []

    const levelSet = (firstItem.evaluation as { level_set?: ApiLevel[] }).level_set
    return Array.isArray(levelSet) ? levelSet : []
  }

  window.fetch = async function (...args) {
    const url = typeof args[0] === "string" ? args[0] : (args[0] as Request)?.url || ""
    const options = args[1] as RequestInit | undefined

    // Capture headers for this specific request (fixes race condition)
    const requestHeaders = isPortflowApi(url) ? extractHeaders(options?.headers) : {}

    const response = await originalFetch.apply(this, args)

    if (CONFIG.API.GOALS_PATTERN.test(url)) {
      try {
        const clonedResponse = response.clone()
        const rawData: unknown = await clonedResponse.json()

        // Validate response is an array
        if (!Array.isArray(rawData)) {
          logger.warn("Goals API response is not an array", { url })
          return response
        }

        // Validate each goal has required fields
        const validGoals = rawData.filter(isValidGoal)
        if (validGoals.length !== rawData.length) {
          logger.warn(`Filtered out ${rawData.length - validGoals.length} invalid goals`)
        }

        const data: ApiGoalsResponse = validGoals

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
                    headers: requestHeaders,
                    credentials: "include",
                  })

                  if (!res.ok) {
                    logger.error(`Failed to fetch ${goal.nickname}: ${res.status}`)
                    return { goal, feedback: null, levelSet: [], error: res.statusText }
                  }

                  const json: unknown = await res.json()

                  // Handle both array and object response formats
                  let rawItems: unknown[]
                  if (Array.isArray(json)) {
                    rawItems = json
                  } else if (json && typeof json === "object" && "data" in json) {
                    const responseData = (json as ApiFeedbackResponse).data
                    rawItems = Array.isArray(responseData) ? responseData : []
                  } else {
                    rawItems = []
                  }

                  // Validate feedback items
                  const validItems = rawItems.filter(isValidFeedbackItem)
                  if (validItems.length !== rawItems.length) {
                    logger.warn(
                      `Filtered out ${rawItems.length - validItems.length} invalid feedback items for ${goal.nickname}`
                    )
                  }

                  const feedback = FeedbackService.processItems(validItems)
                  const levelSet = extractLevelSet(validItems)

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

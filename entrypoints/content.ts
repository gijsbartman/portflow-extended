import { CONFIG } from "../src/constants/config"
import { DomService } from "../src/services/dom.service"
import type { FeedbackCompleteEvent, GoalSummary } from "../src/types"
import { logger } from "../src/utils/logger"

export default defineContentScript({
  matches: ["*://portfolio.drieam.app/*"],
  cssInjectionMode: "ui",
  runAt: "document_start",
  allFrames: true,

  async main(ctx) {
    logger.info("Content script loaded", { href: window.location.href })

    // Monitor SPA navigations
    ctx.addEventListener(window, "wxt:locationchange", ({ newUrl, oldUrl }) => {
      logger.info("Navigation detected", { newUrl, oldUrl })
    })

    // Inject the fetch interceptor into the main world
    await injectScript("/interceptor.js", {
      keepInDom: true,
    })
    logger.success("Interceptor injected")

    // Store latest summaries to re-inject on render
    let currentSummaries: GoalSummary[] = []

    // Listen for feedback data from interceptor
    window.addEventListener(CONFIG.EVENTS.FEEDBACK_COMPLETE, (event: Event) => {
      const customEvent = event as CustomEvent<FeedbackCompleteEvent>
      const { summaries } = customEvent.detail

      logger.success(`Received ${summaries.length} summaries in content script`)
      currentSummaries = summaries

      // Initial injection
      DomService.injectAllStats(currentSummaries)
    })

    // Setup observer to handle dynamic page updates (filters/sorting)
    const observer = DomService.initObserver(() => {
      if (currentSummaries.length > 0) {
        DomService.injectAllStats(currentSummaries)
      }
    })
  },
})

import type { GoalSummary } from "../types"
import { logger } from "../utils/logger"
import { FeedbackService } from "./feedback.service"

export const DomService = {
  STATS_ROW_CLASS: "portflow-ext-stats",

  /**
   * Initialize mutation observer to watch for goal list changes
   */
  initObserver: (onRender: () => void) => {
    const observer = new MutationObserver((mutations) => {
      // Filter out mutations caused by our own injections
      const isExtensionMutation = mutations.every((m) => {
        // Check if added nodes are our stats container or badges
        return Array.from(m.addedNodes).every(
          (node) =>
            (node as HTMLElement).classList?.contains(DomService.STATS_ROW_CLASS) ||
            (node as HTMLElement).classList?.contains("portflow-ext-stats") ||
            (node as HTMLElement).classList?.contains("portflow-ext-badge") ||
            (node as HTMLElement).classList?.contains("portflow-ext-badges-container")
        )
      })

      if (isExtensionMutation) return

      // Check if relevant nodes were added (e.g. goal list items or main container updates)
      const shouldUpdate = mutations.some(
        (m) =>
          m.addedNodes.length > 0 &&
          // Check for specific Portflow list classes OR just general structural updates that aren't us
          !(m.target as HTMLElement).classList?.contains("portflow-ext-stats") &&
          !(m.target as HTMLElement).classList?.contains("portflow-ext-badge") &&
          !(m.target as HTMLElement).classList?.contains("portflow-ext-badges-container")
      )

      if (shouldUpdate) {
        onRender()
      }
    })

    // Observe body for subtree changes since the app is an SPA
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return observer
  },

  /**
   * Find goal element by unique nickname (e.g. "1.1-JKO")
   */
  findGoalElement: (nickname: string): HTMLElement | null => {
    // Strategy: Look for the nickname container text
    const xpath = `//div[contains(@class, '_nicknameContainer') and text()='${nickname}']`
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
    const nicknameContainer = result.singleNodeValue as HTMLElement

    if (!nicknameContainer) return null

    const goalItem = nicknameContainer.closest("._item_rsvp6_1")
    if (!goalItem) return null

    return goalItem as HTMLElement
  },

  /**
   * Get style for a specific level
   */
  getLevelStyle: (level: string | number): { backgroundColor: string; color: string } => {
    const lvl = String(level).toLowerCase()

    // Default style
    const style = { backgroundColor: "", color: "" }

    if (lvl.includes("start")) {
      // Startniveau uses Portflow's badge colors
    } else if (lvl === "1") {
      style.backgroundColor = "#33A3FF"
      style.color = "#e6f4ff"
    } else if (lvl === "2") {
      style.backgroundColor = "#0A91FF"
      style.color = "#e6f4ff"
    } else if (lvl === "3") {
      style.backgroundColor = "#007BE0"
      style.color = "#e6f4ff"
    } else if (lvl === "4") {
      style.backgroundColor = "#0065B8"
      style.color = "#e6f4ff"
    }

    return style
  },

  /**
   * Create a native-styled badge element
   */
  createBadgeElement: (
    label: string,
    value: string | number,
    iconSvg: string,
    customStyle?: { backgroundColor?: string; color?: string }
  ): HTMLElement => {
    // Wrapper span, acts as a spacer/container
    const wrapper = document.createElement("span")
    wrapper.className = "portflow-ext-badge"

    // Button container (Portflow uses buttons for badges)
    const button = document.createElement("button")
    button.type = "button"
    button.setAttribute("aria-disabled", "true")
    button.className = "_button_1kadd_1"
    button.setAttribute("aria-label", `${label}: ${value}`)

    // Outer Badge Container
    const container = document.createElement("div")
    container.className = "_container_z1r9m_1"
    container.title = label

    // Apply custom background to the visual container
    if (customStyle?.backgroundColor) {
      container.style.backgroundColor = customStyle.backgroundColor
      // container.style.borderColor = "transparent" // usually borders are on the button or container, let's assume container for now if button is just wrapper
      // Ensure rounding if it's a pill? Portflow classes probably handle this, but background needs to fill it.
      // If container has padding, this works.
    }
    if (customStyle?.color) {
      container.style.color = customStyle.color
    }

    // Inner Flex Container
    const inner = document.createElement("div")
    inner.className = "_innerContainer_z1r9m_11 ant-flex css-zrgkp"
    inner.style.gap = "4px"

    // Icon
    const iconSpan = document.createElement("span")
    iconSpan.role = "img"
    iconSpan.className = "anticon"
    iconSpan.innerHTML = iconSvg
    if (customStyle?.color) {
      iconSpan.style.color = customStyle.color
    }

    // Value text
    const textNode = document.createTextNode(String(value))

    // Assemble
    inner.appendChild(iconSpan)
    inner.appendChild(textNode)
    container.appendChild(inner)
    button.appendChild(container)
    wrapper.appendChild(button)

    return wrapper
  },

  /**
   * Icons matching standard Ant Design style
   */
  ICONS: {
    CLOCK: `<svg viewBox="64 64 896 896" focusable="false" data-icon="clock-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"></path></svg>`,
    ARROW_UP: `<svg viewBox="64 64 896 896" focusable="false" data-icon="arrow-up" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M868 545.5L536.1 163a31.96 31.96 0 00-48.3 0L156 545.5a7.97 7.97 0 006 13.2h81c4.6 0 9-2 12.1-5.5L474 300.9V864c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V300.9l218.9 252.3c3 3.5 7.4 5.5 12.1 5.5h81c6.8 0 10.5-8 6-13.2z"></path></svg>`,
    EVALS: `<svg viewBox="64 64 896 896" focusable="false" data-icon="comment" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M573 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40zm-280 0c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40zM854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.6-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494zM504 618H320c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM312 490h224c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H312c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"></path></svg>`,
  },

  /**
   * Inject stats row into a goal element
   */
  injectStatsForRow: (goalEl: HTMLElement, summary: GoalSummary) => {
    // Strategy: Find the native badges container in the header row
    // It's distinguished by 'ant-flex-justify-end'
    const nativeBadgesContainer = goalEl.querySelector(".ant-flex-justify-end") as HTMLElement

    if (!nativeBadgesContainer || !nativeBadgesContainer.parentElement) {
      return
    }

    // We want to insert our new container AFTER the native one.
    // Check if we already created our container
    const EXISTING_CLASS = "portflow-ext-badges-container"
    let myContainer = nativeBadgesContainer.parentElement.querySelector(
      `.${EXISTING_CLASS}`
    ) as HTMLElement

    if (myContainer) {
      // Clear it to re-render
      myContainer.innerHTML = ""
    } else {
      // Create new container with exact same classes as native one
      myContainer = document.createElement("div")
      myContainer.className = `ant-flex css-zrgkp ant-flex-wrap-wrap ant-flex-justify-end ${EXISTING_CLASS}`
      myContainer.style.gap = "2px"

      // Insert after the native container
      // parent -> nativeContainer, myContainer
      nativeBadgesContainer.parentElement.insertBefore(
        myContainer,
        nativeBadgesContainer.nextSibling
      )
    }

    // Prepare values
    const recentValue =
      summary.recentLevel && summary.recentLevel !== "-" ? `Niveau ${summary.recentLevel}` : "-"
    const highestValue =
      summary.highestLevel && summary.highestLevel !== "-" ? `Niveau ${summary.highestLevel}` : "-"
    const evalsValue = FeedbackService.formatEvalCount(summary.evalCounts)

    // Resolve styles
    const recentStyle = summary.recentLevel
      ? DomService.getLevelStyle(summary.recentLevel)
      : undefined
    const highestStyle = summary.highestLevel
      ? DomService.getLevelStyle(summary.highestLevel)
      : undefined

    // Create fragments
    const recentBadge = DomService.createBadgeElement(
      "Recent Level",
      recentValue,
      DomService.ICONS.CLOCK,
      recentStyle
    )
    const highestBadge = DomService.createBadgeElement(
      "Highest Level",
      highestValue,
      DomService.ICONS.ARROW_UP,
      highestStyle
    )
    const evalsBadge = DomService.createBadgeElement(
      "Evaluations",
      evalsValue,
      DomService.ICONS.EVALS
    )

    // Append to our new container
    myContainer.appendChild(recentBadge)
    myContainer.appendChild(highestBadge)
    myContainer.appendChild(evalsBadge)
  },

  /**
   * Main entry: Inject stats for all goals
   */
  injectAllStats: (summaries: GoalSummary[]) => {
    let injectedCount = 0
    summaries.forEach((summary) => {
      const el = DomService.findGoalElement(summary.goal.nickname)
      if (el) {
        DomService.injectStatsForRow(el, summary)
        injectedCount++
      }
    })

    if (injectedCount > 0) {
      logger.success(`Injected stats for ${injectedCount} goals`)
    }
  },
}

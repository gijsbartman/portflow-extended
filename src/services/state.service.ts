import type { GoalSummary } from "../types"

/**
 * Extension state types
 */
export interface ExtensionState {
  status: "idle" | "loading" | "success" | "error"
  lastUpdated: number | null
  portfolioId: string | null
  summaries: GoalSummary[]
  error: string | null
  goalCount: number
}

const STORAGE_KEY = "portflow-ext-state"

const DEFAULT_STATE: ExtensionState = {
  status: "idle",
  lastUpdated: null,
  portfolioId: null,
  summaries: [],
  error: null,
  goalCount: 0,
}

/**
 * State Service
 *
 * Manages extension state with persistence to browser.storage.local
 */
export const StateService = {
  /**
   * Get current state from storage
   */
  async getState(): Promise<ExtensionState> {
    try {
      const result = await browser.storage.local.get(STORAGE_KEY)
      const stored = result[STORAGE_KEY]
      if (stored && typeof stored === "object") {
        return { ...DEFAULT_STATE, ...stored } as ExtensionState
      }
      return DEFAULT_STATE
    } catch {
      return DEFAULT_STATE
    }
  },

  /**
   * Update state in storage
   */
  async setState(updates: Partial<ExtensionState>): Promise<ExtensionState> {
    const current = await StateService.getState()
    const newState: ExtensionState = {
      ...current,
      ...updates,
    }
    await browser.storage.local.set({ [STORAGE_KEY]: newState })
    return newState
  },

  /**
   * Mark loading state
   */
  async setLoading(portfolioId: string): Promise<void> {
    await StateService.setState({
      status: "loading",
      portfolioId,
      error: null,
    })
  },

  /**
   * Mark success state with summaries
   */
  async setSuccess(portfolioId: string, summaries: GoalSummary[]): Promise<void> {
    await StateService.setState({
      status: "success",
      portfolioId,
      summaries,
      goalCount: summaries.length,
      lastUpdated: Date.now(),
      error: null,
    })
  },

  /**
   * Mark error state
   */
  async setError(error: string): Promise<void> {
    await StateService.setState({
      status: "error",
      error,
    })
  },

  /**
   * Reset state
   */
  async reset(): Promise<void> {
    await browser.storage.local.remove(STORAGE_KEY)
  },

  /**
   * Format last updated for display
   */
  formatLastUpdated(timestamp: number | null): string {
    if (!timestamp) return "Never"
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  },
}

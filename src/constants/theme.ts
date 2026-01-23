/**
 * Theme Constants
 *
 * Centralized color palette and styling for the extension.
 * Level colors are a blue gradient from light to dark.
 */

export const COLORS = {
  // Level gradient (light to dark blue)
  LEVEL_1: { bg: "#33A3FF", text: "#e6f4ff" },
  LEVEL_2: { bg: "#0A91FF", text: "#e6f4ff" },
  LEVEL_3: { bg: "#007BE0", text: "#e6f4ff" },
  LEVEL_4: { bg: "#0065B8", text: "#e6f4ff" },

  // Status colors
  SUCCESS: "#22c55e",
  WARNING: "#f59e0b",
  ERROR: "#ef4444",
  INFO: "#3b82f6",

  // Neutral
  MUTED: "#6b7280",
  BORDER: "#e5e7eb",
} as const

export type LevelStyleKey = "1" | "2" | "3" | "4"

/**
 * Get style for a specific level
 * Returns undefined for "start" level to use Portflow's default styling
 */
export const getLevelStyle = (
  level: string | number
): { backgroundColor: string; color: string } | undefined => {
  const lvl = String(level).toLowerCase().trim()

  // "Start" level uses Portflow's native styling
  if (lvl.includes("start") || lvl === "0") {
    return undefined
  }

  // Extract numeric level from labels like "Level 2", "L2", "Niveau 2", or just "2"
  const numericMatch = lvl.match(/(\d+)/)
  const numericLevel = numericMatch ? numericMatch[1] : lvl

  const styleMap: Record<string, { backgroundColor: string; color: string }> = {
    "1": { backgroundColor: COLORS.LEVEL_1.bg, color: COLORS.LEVEL_1.text },
    "2": { backgroundColor: COLORS.LEVEL_2.bg, color: COLORS.LEVEL_2.text },
    "3": { backgroundColor: COLORS.LEVEL_3.bg, color: COLORS.LEVEL_3.text },
    "4": { backgroundColor: COLORS.LEVEL_4.bg, color: COLORS.LEVEL_4.text },
  }

  return styleMap[numericLevel]
}

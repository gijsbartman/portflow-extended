import type { ApiLevel } from "../types"

export const getLevelLabel = (score: number | null | undefined, levelSet: ApiLevel[]): string => {
  if (score === null || score === undefined) return "-"

  if (levelSet && levelSet.length > 0) {
    const level = levelSet.find((l) => l.score === score)
    if (level) return level.label
  }

  if (score === 0) return "Start"

  // 2000 = L1, 4000 = L2, etc.
  const levelNum = score / 2000
  if (Number.isInteger(levelNum)) {
    return `L${levelNum}`
  }

  return `${score}`
}

export const sortByDateDesc = <T extends { date: Date | string }>(items: T[]): T[] => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA
  })
}

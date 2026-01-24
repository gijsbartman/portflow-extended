import type { curriculum } from "../constants/curriculum"
import type { GoalSummary } from "../types"

type Course = (typeof curriculum)[number]
type LevelStatus = "op_niveau" | "niet_op_niveau" | "boven_niveau"

/**
 * Check if a goal is HBOI (starts with HBOi-)
 */
const isHBOIGoal = (nickname: string): boolean => {
  return nickname.startsWith("HBOi-")
}

/**
 * Check if a goal is KPM (specifically 1.2-KPM)
 */
const isKPMGoal = (nickname: string): boolean => {
  return nickname === "1.2-KPM"
}

/**
 * Check if a goal is a general skill (not HBOI, not KPM)
 */
const isSkillGoal = (nickname: string): boolean => {
  return !isHBOIGoal(nickname) && !isKPMGoal(nickname)
}

/**
 * Parse level string (e.g., "L1", "L2", "3") to number
 */
const parseLevelString = (levelStr: string | null): number | null => {
  if (!levelStr || levelStr === "-") return null

  // Try to match "L1", "L2" format
  const lMatch = levelStr.match(/L(\d+)/)
  if (lMatch) return parseInt(lMatch[1], 10)

  // Try to parse as plain number
  const num = parseInt(levelStr, 10)
  if (!isNaN(num)) return num

  return null
}

/**
 * Check if user has required skill evaluations at specified levels
 * Skills need 2+ successful evaluations
 */
const hasSkillRequirements = (
  summaries: GoalSummary[],
  requirements: Record<string, number> | null
): boolean => {
  if (!requirements) return true

  const skillGoals = summaries.filter((s) => isSkillGoal(s.goal.nickname))

  for (const [levelKey, requiredCount] of Object.entries(requirements)) {
    const requiredLevel = parseInt(levelKey.replace("level_", ""), 10)

    const levelQualified = skillGoals.filter((s) => {
      const achievedLevel = parseLevelString(s.highestLevel)
      return achievedLevel !== null && achievedLevel >= requiredLevel
    })

    const qualified = levelQualified.filter((s) => s.evalCounts.valid >= 2)

    if (qualified.length < requiredCount) {
      return false
    }
  }

  return true
}

/**
 * Check if user has required HBOI evaluations at specified levels
 * HBOI needs 1+ successful evaluation
 */
const hasHBOIRequirements = (
  summaries: GoalSummary[],
  requirements: Record<string, number> | null
): boolean => {
  if (!requirements) return true

  const hboiGoals = summaries.filter((s) => isHBOIGoal(s.goal.nickname))

  for (const [levelKey, requiredCount] of Object.entries(requirements)) {
    const requiredLevel = parseInt(levelKey.replace("level_", ""), 10)

    const qualified = hboiGoals.filter((s) => {
      const hasEnoughEvals = s.evalCounts.valid >= 1
      const achievedLevel = parseLevelString(s.highestLevel)
      return hasEnoughEvals && achievedLevel !== null && achievedLevel >= requiredLevel
    })

    if (qualified.length < requiredCount) {
      return false
    }
  }

  return true
}

/**
 * Check if user has required KPM level
 * KPM needs 2+ successful evaluations
 */
const hasKPMRequirement = (summaries: GoalSummary[], requiredLevel: number | null): boolean => {
  if (requiredLevel === null) return true

  const kpmGoal = summaries.find((s) => isKPMGoal(s.goal.nickname))
  if (!kpmGoal) return false

  const hasEnoughEvals = kpmGoal.evalCounts.valid >= 2
  const achievedLevel = parseLevelString(kpmGoal.highestLevel)

  return hasEnoughEvals && achievedLevel !== null && achievedLevel >= requiredLevel
}

/**
 * Check if user meets course requirements
 * Returns: "op_niveau", "niet_op_niveau", or "boven_niveau"
 */
export const checkCourseLevel = (
  summaries: GoalSummary[],
  course: Course,
  nextCourse: Course | null
): LevelStatus => {
  // Check current course requirements
  const hasSkills = hasSkillRequirements(summaries, course.skills_general)
  const hasHBOI = hasHBOIRequirements(summaries, course.hboi)
  const hasKPM = hasKPMRequirement(summaries, course.kpm_level)

  const meetsCurrentRequirements = hasSkills && hasHBOI && hasKPM

  if (!meetsCurrentRequirements) {
    return "niet_op_niveau"
  }

  // Check if they meet next semester requirements (skills only, not HBOI)
  if (nextCourse) {
    const hasNextSkills = hasSkillRequirements(summaries, nextCourse.skills_general)
    const hasNextKPM = hasKPMRequirement(summaries, nextCourse.kpm_level)

    if (hasNextSkills && hasNextKPM) {
      return "boven_niveau"
    }
  }

  return "op_niveau"
}

/**
 * Get detailed requirements status for debugging/display
 */
export const getRequirementsStatus = (summaries: GoalSummary[], course: Course) => {
  return {
    skills: hasSkillRequirements(summaries, course.skills_general),
    hboi: hasHBOIRequirements(summaries, course.hboi),
    kpm: hasKPMRequirement(summaries, course.kpm_level),
  }
}

type SkillLevels = {
  level_0?: number
  level_1?: number
  level_2?: number
  level_3?: number
  level_4?: number
}

interface UserProgress {
  skills: SkillLevels | null
  hboi: SkillLevels | null
  kpm: number | null
}

/**
 * Get user's current progress in SkillLevels format
 * Counts goals that meet the evaluation requirements at each level
 */
export const getUserProgress = (summaries: GoalSummary[]): UserProgress => {
  const skillGoals = summaries.filter((s) => isSkillGoal(s.goal.nickname))
  const hboiGoals = summaries.filter((s) => isHBOIGoal(s.goal.nickname))
  const kpmGoal = summaries.find((s) => isKPMGoal(s.goal.nickname))

  // Count skills at each level (needs 2+ evals)
  const skillLevels: SkillLevels = {}
  for (const goal of skillGoals) {
    if (goal.evalCounts.valid >= 2) {
      const level = parseLevelString(goal.highestLevel)
      if (level !== null) {
        const key = `level_${level}` as keyof SkillLevels
        skillLevels[key] = (skillLevels[key] ?? 0) + 1
      }
    }
  }

  // Count HBOI at each level (needs 1+ eval)
  const hboiLevels: SkillLevels = {}
  for (const goal of hboiGoals) {
    if (goal.evalCounts.valid >= 1) {
      const level = parseLevelString(goal.highestLevel)
      if (level !== null) {
        const key = `level_${level}` as keyof SkillLevels
        hboiLevels[key] = (hboiLevels[key] ?? 0) + 1
      }
    }
  }

  // Get KPM level (needs 2+ evals)
  let kpmLevel: number | null = null
  if (kpmGoal && kpmGoal.evalCounts.valid >= 2) {
    kpmLevel = parseLevelString(kpmGoal.highestLevel)
  }

  return {
    skills: Object.keys(skillLevels).length > 0 ? skillLevels : null,
    hboi: Object.keys(hboiLevels).length > 0 ? hboiLevels : null,
    kpm: kpmLevel,
  }
}

interface MissingRequirements {
  skills: SkillLevels | null
  hboi: SkillLevels | null
  kpm: number | null
}

/**
 * Calculate what's missing to meet course requirements
 * Returns the difference between required and achieved for each category
 */
export const getMissingRequirements = (
  summaries: GoalSummary[],
  course: Course
): MissingRequirements => {
  const skillGoals = summaries.filter((s) => isSkillGoal(s.goal.nickname))
  const hboiGoals = summaries.filter((s) => isHBOIGoal(s.goal.nickname))
  const kpmGoal = summaries.find((s) => isKPMGoal(s.goal.nickname))

  // Calculate missing skills
  const missingSkills: SkillLevels = {}
  if (course.skills_general) {
    for (const [levelKey, requiredCount] of Object.entries(course.skills_general)) {
      const requiredLevel = parseInt(levelKey.replace("level_", ""), 10)

      const qualified = skillGoals.filter((s) => {
        const achievedLevel = parseLevelString(s.highestLevel)
        return achievedLevel !== null && achievedLevel >= requiredLevel && s.evalCounts.valid >= 2
      })

      const missing = requiredCount - qualified.length
      if (missing > 0) {
        const key = `level_${requiredLevel}` as keyof SkillLevels
        missingSkills[key] = missing
      }
    }
  }

  // Calculate missing HBOI
  const missingHboi: SkillLevels = {}
  if (course.hboi) {
    for (const [levelKey, requiredCount] of Object.entries(course.hboi)) {
      const requiredLevel = parseInt(levelKey.replace("level_", ""), 10)

      const qualified = hboiGoals.filter((s) => {
        const achievedLevel = parseLevelString(s.highestLevel)
        return achievedLevel !== null && achievedLevel >= requiredLevel && s.evalCounts.valid >= 1
      })

      const missing = requiredCount - qualified.length
      if (missing > 0) {
        const key = `level_${requiredLevel}` as keyof SkillLevels
        missingHboi[key] = missing
      }
    }
  }

  // Calculate missing KPM
  let missingKpm: number | null = null
  if (course.kpm_level !== null) {
    const achievedLevel =
      kpmGoal && kpmGoal.evalCounts.valid >= 2 ? parseLevelString(kpmGoal.highestLevel) : null
    if (achievedLevel === null || achievedLevel < course.kpm_level) {
      missingKpm = course.kpm_level
    }
  }

  return {
    skills: Object.keys(missingSkills).length > 0 ? missingSkills : null,
    hboi: Object.keys(missingHboi).length > 0 ? missingHboi : null,
    kpm: missingKpm,
  }
}

import { curriculum } from "@/src/constants/curriculum"
import type { Course, GoalSummary, SkillLevels } from "@/src/types"
import { cn } from "@/src/utils/cn"
import {
  checkCourseLevel,
  getMissingRequirements,
  getUserProgress,
} from "@/src/utils/level-checker.utils"
import { createContext, useContext, useState, type HTMLAttributes, type ReactNode } from "react"
import { Select, SelectLabel } from "./select"

interface UserProgress {
  skills: SkillLevels | null
  hboi: SkillLevels | null
  kpm: number | null
}

interface MissingRequirements {
  skills: SkillLevels | null
  hboi: SkillLevels | null
  kpm: number | null
}

type LevelStatus = "op_niveau" | "niet_op_niveau" | "boven_niveau" | null

interface RequirementsContextValue {
  selectedCourseIndex: number | null
  setSelectedCourseIndex: (index: number | null) => void
  selectedCourse: Course | null
  nextCourse: Course | null
  summaries: GoalSummary[]
  userProgress: UserProgress
  status: LevelStatus
  missingForCurrent: MissingRequirements | null
  missingForNext: MissingRequirements | null
}

const RequirementsContext = createContext<RequirementsContextValue | null>(null)

function useRequirements() {
  const context = useContext(RequirementsContext)
  if (!context) {
    throw new Error("Requirements compound components must be used within Requirements")
  }
  return context
}

interface RequirementsProps extends HTMLAttributes<HTMLDivElement> {
  summaries: GoalSummary[]
  children: ReactNode
}

function Requirements({ summaries, children, className, ...props }: RequirementsProps) {
  const [selectedCourseIndex, setSelectedCourseIndex] = useState<number | null>(null)
  const selectedCourse = selectedCourseIndex !== null ? curriculum[selectedCourseIndex] : null
  const nextCourse =
    selectedCourseIndex !== null && selectedCourseIndex < curriculum.length - 1
      ? curriculum[selectedCourseIndex + 1]
      : null

  const userProgress = getUserProgress(summaries)
  const status = selectedCourse ? checkCourseLevel(summaries, selectedCourse, nextCourse) : null
  const missingForCurrent = selectedCourse
    ? getMissingRequirements(summaries, selectedCourse)
    : null
  const missingForNext = nextCourse ? getMissingRequirements(summaries, nextCourse) : null

  return (
    <RequirementsContext.Provider
      value={{
        selectedCourseIndex,
        setSelectedCourseIndex,
        selectedCourse,
        nextCourse,
        summaries,
        userProgress,
        status,
        missingForCurrent,
        missingForNext,
      }}
    >
      <div data-slot="requirements" className={cn(className)} {...props}>
        {children}
      </div>
    </RequirementsContext.Provider>
  )
}

interface RequirementsSelectProps extends HTMLAttributes<HTMLDivElement> {}

function RequirementsSelect({ className, ...props }: RequirementsSelectProps) {
  const { selectedCourseIndex, setSelectedCourseIndex } = useRequirements()

  return (
    <div className={className} {...props}>
      <SelectLabel htmlFor="requirements-select">Semester</SelectLabel>
      <Select
        id="requirements-select"
        value={selectedCourseIndex ?? ""}
        onChange={(e) => {
          const value = e.target.value
          setSelectedCourseIndex(value === "" ? null : parseInt(value, 10))
        }}
      >
        <option value="">-- Kies een semester --</option>
        {curriculum.map((course, index) => (
          <option key={index} value={index}>
            Jaar {course.year}, Semester {course.semester}: {course.course}
          </option>
        ))}
      </Select>
    </div>
  )
}

interface RequirementsGroupProps extends HTMLAttributes<HTMLDivElement> {}

function RequirementsGroup({ className, children, ...props }: RequirementsGroupProps) {
  return (
    <div className={cn("space-y-2 border-b border-slate-200 px-3 py-2", className)} {...props}>
      {children}
    </div>
  )
}

interface RequirementsHeaderProps extends HTMLAttributes<HTMLDivElement> {}

function RequirementsHeader({ className, children, ...props }: RequirementsHeaderProps) {
  return (
    <h4
      className={cn("text-xs font-semibold tracking-wider text-slate-500 uppercase", className)}
      {...props}
    >
      {children ?? "Vereisten"}
    </h4>
  )
}

interface RequirementsListProps extends HTMLAttributes<HTMLDivElement> {}

function RequirementsList({ className, children, ...props }: RequirementsListProps) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  )
}

interface RequirementsItemProps extends HTMLAttributes<HTMLDivElement> {
  label: string
}

function RequirementsItem({ label, children, className, ...props }: RequirementsItemProps) {
  return (
    <div
      data-slot="requirements-item"
      className={cn(
        "-mx-1 flex min-h-5.5 items-start justify-between rounded px-1 py-0.5 text-xs",
        className
      )}
      {...props}
    >
      <span className="font-medium whitespace-nowrap text-slate-700">{label}</span>
      <div className="flex items-start gap-1.5">{children}</div>
    </div>
  )
}

export {
  Requirements,
  RequirementsGroup,
  RequirementsHeader,
  RequirementsItem,
  RequirementsList,
  RequirementsSelect,
  useRequirements,
}

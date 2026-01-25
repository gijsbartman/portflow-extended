import { SkillLevels } from "@/src/types"
import { cn } from "@/src/utils/cn"
import type { HTMLAttributes } from "react"
import { Badge } from "./badge"

interface NiveauBadgesProps extends HTMLAttributes<HTMLDivElement> {
  levels: SkillLevels | number | null
}

export function NiveauBadges({ levels, className, ...props }: NiveauBadgesProps) {
  if (levels === null) {
    return (
      <div className={cn("text-slate-400", className)} {...props}>
        N/A
      </div>
    )
  }

  if (typeof levels === "number") {
    const variant = `level_${levels}` as "level_0" | "level_1" | "level_2" | "level_3" | "level_4"
    return (
      <div className={cn("flex items-center gap-1", className)} {...props}>
        <Badge variant={variant}>Niveau {levels}</Badge>
      </div>
    )
  }

  const requirementItems = Object.entries(levels)
    .map(([levelKey, count]) => {
      const levelNum = levelKey.replace("level_", "")
      const variant = `level_${levelNum}` as
        | "level_0"
        | "level_1"
        | "level_2"
        | "level_3"
        | "level_4"
      return { levelNum: parseInt(levelNum, 10), count, variant }
    })
    .sort((a, b) => a.levelNum - b.levelNum)

  return (
    <div
      className={cn("flex flex-wrap items-start justify-end gap-x-2 gap-y-1", className)}
      {...props}
    >
      {requirementItems.map(({ levelNum, count, variant }) => (
        <div key={levelNum} className="flex items-center gap-1">
          <span className="font-medium text-slate-700">{count} x</span>
          <Badge variant={variant}>Niveau {levelNum}</Badge>
        </div>
      ))}
    </div>
  )
}

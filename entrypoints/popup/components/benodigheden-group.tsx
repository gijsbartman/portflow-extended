import { getGoalsWithInsufficientEvals } from "@/src/utils/level-checker.utils"
import { NiveauBadges } from "./ui/niveau-badges"
import {
  RequirementsGroup,
  RequirementsHeader,
  RequirementsItem,
  RequirementsList,
  useRequirements,
} from "./ui/requirements"

export function BenodighedenGroup() {
  const { status, missingForCurrent, missingForNext, summaries } = useRequirements()

  if (!status) {
    return
  }

  // Determine what's missing based on status
  const missing = status === "niet_op_niveau" ? missingForCurrent : missingForNext
  const hasMissing = missing && (missing.skills || missing.hboi || missing.kpm)

  const missingLabel =
    status === "niet_op_niveau" ? "op niveau" : status === "op_niveau" ? "boven niveau" : null

  // Get goals that need more evaluations
  const insufficientEvals = getGoalsWithInsufficientEvals(summaries)

  if (!hasMissing || !missingLabel) {
    return
  }

  return (
    <RequirementsGroup>
      <RequirementsHeader>Benodigheden voor {missingLabel}</RequirementsHeader>
      {missing.skills && (
        <RequirementsList className="-space-y-0.5">
          <RequirementsItem label="Vaardigheden">
            <NiveauBadges levels={missing.skills} />
          </RequirementsItem>
          {insufficientEvals.skills.map((skill) => (
            <RequirementsItem
              className="ml-2 min-h-0 text-[10px]"
              key={skill.nickname}
              label={skill.name}
            >
              <div className="flex items-center gap-1 text-slate-700">
                <p>
                  {skill.currentEvals}/{skill.requiredEvals} evaluaties
                </p>
              </div>
            </RequirementsItem>
          ))}
        </RequirementsList>
      )}

      {missing.kpm && (
        <RequirementsList className="-space-y-0.5">
          <RequirementsItem label="KPM">
            <NiveauBadges levels={missing.kpm} />
          </RequirementsItem>
          {insufficientEvals.kpm && (
            <RequirementsItem
              className="ml-2 min-h-0 text-[10px]"
              label={insufficientEvals.kpm.name}
            >
              <div className="flex items-center gap-1 text-slate-700">
                <p>
                  {insufficientEvals.kpm.currentEvals}/{insufficientEvals.kpm.requiredEvals}{" "}
                  evaluaties
                </p>
              </div>
            </RequirementsItem>
          )}
        </RequirementsList>
      )}
      {missing.hboi && (
        <RequirementsList className="-space-y-0.5">
          <RequirementsItem label="HBO-I">
            <NiveauBadges levels={missing.hboi} />
          </RequirementsItem>
          {insufficientEvals.hboi.map((hboi) => (
            <RequirementsItem
              className="ml-2 min-h-0 text-[10px]"
              key={hboi.nickname}
              label={hboi.name}
            >
              <div className="flex items-center gap-1 text-slate-700">
                <p>
                  {hboi.currentEvals}/{hboi.requiredEvals} evaluaties
                </p>
              </div>
            </RequirementsItem>
          ))}
        </RequirementsList>
      )}
    </RequirementsGroup>
  )
}

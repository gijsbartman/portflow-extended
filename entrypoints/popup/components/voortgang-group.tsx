import { getAllGoalEvals } from "@/src/utils/level-checker.utils"
import { NiveauBadges } from "./ui/niveau-badges"
import {
  RequirementsGroup,
  RequirementsItem,
  RequirementsList,
  useRequirements,
} from "./ui/requirements"

export function VoortgangGroup() {
  const { userProgress, summaries } = useRequirements()
  const allEvals = getAllGoalEvals(summaries)

  return (
    <RequirementsGroup>
      <RequirementsList className="-space-y-0.5">
        <RequirementsItem label="Vaardigheden">
          <NiveauBadges levels={userProgress.skills} />
        </RequirementsItem>
        {allEvals.skills.map((skill) => (
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

      <RequirementsList className="-space-y-0.5">
        <RequirementsItem label="KPM">
          <NiveauBadges levels={userProgress.kpm} />
        </RequirementsItem>
        {allEvals.kpm && (
          <RequirementsItem className="ml-2 min-h-0 text-[10px]" label={allEvals.kpm.name}>
            <div className="flex items-center gap-1 text-slate-700">
              <p>
                {allEvals.kpm.currentEvals}/{allEvals.kpm.requiredEvals} evaluaties
              </p>
            </div>
          </RequirementsItem>
        )}
      </RequirementsList>

      <RequirementsList className="-space-y-0.5">
        <RequirementsItem label="HBO-I">
          <NiveauBadges levels={userProgress.hboi} />
        </RequirementsItem>
        {/* HBOi hebben maar 1 evaluatie nodig dus onnodig om te laten zien */}
        {/* {allEvals.hboi.map((hboi) => (
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
        ))} */}
      </RequirementsList>
    </RequirementsGroup>
  )
}

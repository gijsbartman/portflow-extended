import { NiveauBadges } from "./ui/niveau-badges"
import { RequirementsItem, RequirementsList, useRequirements } from "./ui/requirements"

export function VoortgangList() {
  const { userProgress } = useRequirements()

  return (
    <RequirementsList>
      <RequirementsItem label="Vaardigheden">
        <NiveauBadges levels={userProgress.skills} />
      </RequirementsItem>
      <RequirementsItem label="KPM">
        <NiveauBadges levels={userProgress.kpm} />
      </RequirementsItem>
      <RequirementsItem label="HBO-I">
        <NiveauBadges levels={userProgress.hboi} />
      </RequirementsItem>
    </RequirementsList>
  )
}

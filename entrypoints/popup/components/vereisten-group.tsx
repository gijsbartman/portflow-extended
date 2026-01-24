import { NiveauBadges } from "./ui/niveau-badges"
import {
  RequirementsGroup,
  RequirementsHeader,
  RequirementsItem,
  RequirementsList,
  useRequirements,
} from "./ui/requirements"

export function VereistenGroup() {
  const { selectedCourse, status } = useRequirements()

  if (!status) {
    return
  }

  return (
    <RequirementsGroup>
      <RequirementsHeader>Vereisten</RequirementsHeader>

      <RequirementsList>
        <RequirementsItem label="Vaardigheden">
          <NiveauBadges levels={selectedCourse?.skills_general ?? null} />
        </RequirementsItem>
        <RequirementsItem label="KPM">
          <NiveauBadges levels={selectedCourse?.kpm_level ?? null} />
        </RequirementsItem>
        <RequirementsItem label="HBO-I">
          <NiveauBadges levels={selectedCourse?.hboi ?? null} />
        </RequirementsItem>
      </RequirementsList>
    </RequirementsGroup>
  )
}

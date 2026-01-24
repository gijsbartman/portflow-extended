import { NiveauBadges } from "./ui/niveau-badges"
import {
  RequirementsGroup,
  RequirementsHeader,
  RequirementsItem,
  RequirementsList,
  useRequirements,
} from "./ui/requirements"

export function BenodighedenGroup() {
  const { status, missingForCurrent, missingForNext } = useRequirements()

  if (!status) {
    return
  }

  // Determine what's missing based on status
  const missing = status === "niet_op_niveau" ? missingForCurrent : missingForNext
  const hasMissing = missing && (missing.skills || missing.hboi || missing.kpm)

  const missingLabel =
    status === "niet_op_niveau" ? "op niveau" : status === "op_niveau" ? "boven niveau" : null

  if (!hasMissing || !missingLabel) {
    return
  }

  return (
    <RequirementsGroup>
      <RequirementsHeader>Benodigheden {missingLabel}</RequirementsHeader>
      <RequirementsList>
        {missing.skills && (
          <RequirementsItem label="Vaardigheden">
            <NiveauBadges levels={missing.skills} />
          </RequirementsItem>
        )}
        {missing.kpm && (
          <RequirementsItem label="KPM">
            <NiveauBadges levels={missing.kpm} />
          </RequirementsItem>
        )}
        {missing.hboi && (
          <RequirementsItem label="HBO-I">
            <NiveauBadges levels={missing.hboi} />
          </RequirementsItem>
        )}
      </RequirementsList>
    </RequirementsGroup>
  )
}

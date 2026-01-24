import { Badge } from "./ui/badge"
import { RequirementsGroup, RequirementsHeader, useRequirements } from "./ui/requirements"

const STATUS_LABELS = {
  niet_op_niveau: "Niet op niveau",
  op_niveau: "Op niveau",
  boven_niveau: "Boven niveau",
}

export function AssessmentGroup() {
  const { status } = useRequirements()

  if (!status) {
    return
  }

  return (
    <RequirementsGroup className="flex justify-between space-y-0">
      <RequirementsHeader>Assessment</RequirementsHeader>
      <Badge variant={status}>{STATUS_LABELS[status]}</Badge>
    </RequirementsGroup>
  )
}

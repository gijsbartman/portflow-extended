import "@/assets/tailwind.css"
import type { ExtensionState } from "@/src/types"
import { AlertCircle, AlertTriangle, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { curriculum } from "../../src/constants/curriculum"
import { StateService } from "../../src/services/state.service"
import { AssessmentGroup } from "./components/assessment-group"
import { BenodighedenGroup } from "./components/benodigheden-group"
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert"
import { Requirements, RequirementsSelect } from "./components/ui/requirements"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { VereistenGroup } from "./components/vereisten-group"
import { VoortgangGroup } from "./components/voortgang-group"

function App() {
  const [state, setState] = useState<ExtensionState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCourseIndex, setSelectedCourseIndex] = useState<number | null>(null)

  useEffect(() => {
    const loadState = async () => {
      try {
        const currentState = await StateService.getState()
        setState(currentState)
      } catch (error) {
        console.error("Failed to load state:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadState()

    // Listen for storage changes
    const handleStorageChange = () => {
      loadState()
    }
    browser.storage.onChanged.addListener(handleStorageChange)

    return () => {
      browser.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[500px] w-[360px] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  const selectedCourse = selectedCourseIndex !== null ? curriculum[selectedCourseIndex] : null
  const nextCourse =
    selectedCourseIndex !== null && selectedCourseIndex < curriculum.length - 1
      ? curriculum[selectedCourseIndex + 1]
      : null

  return (
    <div id="portflow-extended-popup" className="h-fit max-h-[600px] w-[360px] overflow-y-auto">
      <header className="bg-primary sticky inset-x-0 top-0 flex h-12 flex-col justify-center border-slate-200 px-4 text-white">
        <h1 className="text-sm font-semibold">Portflow Extended</h1>
        <p
          className="text-xs opacity-80"
          title="Ga in Portflow naar 'Doelen & Voortgang' om te updaten"
        >
          Updated {StateService.formatLastUpdated(state?.lastUpdated ?? null)}
        </p>
      </header>
      <main>
        <Requirements summaries={state?.summaries ?? []}>
          <Tabs>
            <TabsList className="sticky top-12 w-full">
              <TabsTrigger className="rounded-t-none" value="voortgang">
                Voortgang
              </TabsTrigger>
              <TabsTrigger className="rounded-t-none" value="assessment">
                Assessment
              </TabsTrigger>
            </TabsList>
            <TabsContent value="voortgang">
              <VoortgangGroup />
            </TabsContent>
            <TabsContent value="assessment">
              <RequirementsSelect className="border-b border-slate-200 px-3 pt-2 pb-3" />
              <VereistenGroup />
              <AssessmentGroup />
              <BenodighedenGroup />
            </TabsContent>
          </Tabs>
        </Requirements>

        {selectedCourse && (!state?.summaries || state.summaries.length === 0) && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Geen data beschikbaar</AlertTitle>
            <AlertDescription>
              Navigeer in Portflow naar "Doelen & Voortgang" om je voortgang te laden
            </AlertDescription>
          </Alert>
        )}

        {state?.error && (
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  )
}

export default App

import "@/assets/tailwind.css"
import { useEffect, useState } from "react"
import { StateService, type ExtensionState } from "../../src/services/state.service"

function App() {
  const [state, setState] = useState<ExtensionState | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
      <div className="flex h-[300px] w-[320px] items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="h-[300px] w-[320px] bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="border-b border-slate-700/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold">Portflow Extended</h1>
            <p className="text-xs text-slate-400">Goal Insights Dashboard</p>
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div className="px-4 py-3">
        <div className="rounded-lg bg-slate-800/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Status</span>
            <StatusBadge status={state?.status ?? "idle"} />
          </div>

          {state?.error && (
            <div className="mt-2 rounded bg-red-500/10 px-2 py-1.5 text-xs text-red-400">
              {state.error}
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 px-4">
        <StatCard
          label="Goals Tracked"
          value={state?.goalCount ?? 0}
          icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
        />
        <StatCard
          label="Last Updated"
          value={StateService.formatLastUpdated(state?.lastUpdated ?? null)}
          icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Portfolio Info */}
      {state?.portfolioId && (
        <div className="px-4 pt-3">
          <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span>Portfolio ID: {state.portfolioId}</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="absolute right-0 bottom-0 left-0 border-t border-slate-700/50 bg-slate-900/50 px-4 py-2">
        <p className="text-center text-[10px] text-slate-500">
          Navigate to Portflow to see goal insights
        </p>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: ExtensionState["status"] }) {
  const config = {
    idle: { label: "Idle", className: "bg-slate-600" },
    loading: { label: "Loading...", className: "bg-blue-500 animate-pulse" },
    success: { label: "Active", className: "bg-emerald-500" },
    error: { label: "Error", className: "bg-red-500" },
  }

  const { label, className } = config[status]

  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${className}`}>{label}</span>
  )
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-blue-400">{icon}</div>
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-[10px] text-slate-400">{label}</p>
    </div>
  )
}

export default App

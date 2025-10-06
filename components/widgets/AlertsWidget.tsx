"use client"

import { BaseWidget } from "./BaseWidget"
import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Alert {
  id: string
  type: "critical" | "warning" | "info"
  message: string
  source: string
  timestamp: string
  acknowledged: boolean
}

interface AlertsWidgetProps {
  id: string
  title?: string
  alerts?: Alert[]
}

const defaultAlerts: Alert[] = [
  {
    id: "A001",
    type: "critical",
    message: "Motor temperature exceeds safe limits",
    source: "Production Line A",
    timestamp: "2 min ago",
    acknowledged: false,
  },
  {
    id: "A002",
    type: "warning",
    message: "Low hydraulic pressure detected",
    source: "Press Machine 3",
    timestamp: "5 min ago",
    acknowledged: false,
  },
  {
    id: "A003",
    type: "info",
    message: "Scheduled maintenance reminder",
    source: "Conveyor Belt 2",
    timestamp: "15 min ago",
    acknowledged: true,
  },
  {
    id: "A004",
    type: "warning",
    message: "Quality check required",
    source: "QC Station 1",
    timestamp: "23 min ago",
    acknowledged: false,
  },
]

export function AlertsWidget({ id, title = "System Alerts", alerts = defaultAlerts }: AlertsWidgetProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "critical":
        return (
          <Badge variant="destructive" className="text-xs">
            Critical
          </Badge>
        )
      case "warning":
        return (
          <Badge
            variant="secondary"
            className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          >
            Warning
          </Badge>
        )
      case "info":
        return (
          <Badge variant="secondary" className="text-xs">
            Info
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Unknown
          </Badge>
        )
    }
  }

  const criticalCount = alerts.filter((a) => a.type === "critical" && !a.acknowledged).length
  const warningCount = alerts.filter((a) => a.type === "warning" && !a.acknowledged).length
  const totalUnacknowledged = alerts.filter((a) => !a.acknowledged).length

  return (
    <BaseWidget id={id} title={title}>
      <div className="space-y-4">
        {/* Alert Summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-red-50 dark:bg-red-950/20 rounded">
            <div className="text-lg font-bold text-red-600 dark:text-red-400">{criticalCount}</div>
            <div className="text-xs text-red-600 dark:text-red-400">Critical</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{warningCount}</div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">Warning</div>
          </div>
          <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
            <div className="text-lg font-bold text-slate-600 dark:text-slate-400">{totalUnacknowledged}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Total</div>
          </div>
        </div>

        {/* Alert List */}
        <ScrollArea className="h-40">
          <div className="space-y-2">
            {alerts.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-400">No active alerts</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${
                    alert.acknowledged
                      ? "bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 opacity-60"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getAlertBadge(alert.type)}
                        {alert.acknowledged && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Ack
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 dark:text-slate-400">
                        <span>{alert.source}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{alert.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </BaseWidget>
  )
}

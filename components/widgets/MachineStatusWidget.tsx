"use client"

import { BaseWidget } from "./BaseWidget"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface MachineStatusWidgetProps {
  id: string
  title?: string
  machineData?: {
    name: string
    status: "running" | "idle" | "maintenance" | "error"
    efficiency: number
    temperature: number
    uptime: string
  }
}

const defaultMachineData = {
  name: "Production Line A",
  status: "running" as const,
  efficiency: 87,
  temperature: 72,
  uptime: "23h 45m",
}

export function MachineStatusWidget({
  id,
  title = "Machine Status",
  machineData = defaultMachineData,
}: MachineStatusWidgetProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "idle":
        return <Activity className="h-4 w-4 text-yellow-500" />
      case "maintenance":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "maintenance":
        return "bg-orange-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <BaseWidget id={id} title={title}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">{machineData.name}</h3>
          <Badge variant="outline" className="flex items-center gap-1">
            {getStatusIcon(machineData.status)}
            {machineData.status.charAt(0).toUpperCase() + machineData.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Efficiency</span>
              <span className="font-medium">{machineData.efficiency}%</span>
            </div>
            <Progress value={machineData.efficiency} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Temperature</span>
              <span className="font-medium">{machineData.temperature}°C</span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStatusColor(machineData.status)} transition-all duration-300`}
                style={{ width: `${Math.min((machineData.temperature / 100) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Uptime</span>
            <span className="font-medium text-green-600 dark:text-green-400">{machineData.uptime}</span>
          </div>
        </div>
      </div>
    </BaseWidget>
  )
}

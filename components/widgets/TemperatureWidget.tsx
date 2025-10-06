"use client"

import { BaseWidget } from "./BaseWidget"
import { Thermometer, AlertTriangle, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface TemperatureData {
  current: number
  unit: string
  min: number
  max: number
  optimal: { min: number; max: number }
  sensors: Array<{ id: string; name: string; value: number; status: "normal" | "warning" | "critical" }>
}

interface TemperatureWidgetProps {
  id: string
  title?: string
  data?: TemperatureData
}

const defaultData: TemperatureData = {
  current: 72.5,
  unit: "°C",
  min: 68.2,
  max: 78.9,
  optimal: { min: 70, max: 75 },
  sensors: [
    { id: "T001", name: "Bearing 1", value: 72.5, status: "normal" },
    { id: "T002", name: "Bearing 2", value: 74.1, status: "normal" },
    { id: "T003", name: "Motor", value: 76.8, status: "warning" },
    { id: "T004", name: "Gearbox", value: 71.2, status: "normal" },
  ],
}

export function TemperatureWidget({
  id,
  title = "Temperature Monitoring",
  data = defaultData,
}: TemperatureWidgetProps) {
  const getTemperatureStatus = (temp: number, optimal: { min: number; max: number }) => {
    if (temp >= optimal.min && temp <= optimal.max) return "normal"
    if (temp > optimal.max + 5 || temp < optimal.min - 5) return "critical"
    return "warning"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-3 w-3 text-yellow-500" />
      case "critical":
        return <AlertTriangle className="h-3 w-3 text-red-500" />
      default:
        return <CheckCircle className="h-3 w-3 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600 dark:text-green-400"
      case "warning":
        return "text-yellow-600 dark:text-yellow-400"
      case "critical":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const currentStatus = getTemperatureStatus(data.current, data.optimal)
  const tempPercentage = ((data.current - data.min) / (data.max - data.min)) * 100

  return (
    <BaseWidget id={id} title={title}>
      <div className="space-y-4">
        {/* Current Temperature */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Thermometer className="h-6 w-6 text-blue-500" />
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {data.current}
              {data.unit}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1">
            {getStatusIcon(currentStatus)}
            <span className={`text-sm capitalize ${getStatusColor(currentStatus)}`}>{currentStatus}</span>
          </div>
        </div>

        {/* Temperature Range */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>
              Min: {data.min}
              {data.unit}
            </span>
            <span>
              Optimal: {data.optimal.min}-{data.optimal.max}
              {data.unit}
            </span>
            <span>
              Max: {data.max}
              {data.unit}
            </span>
          </div>
          <Progress value={tempPercentage} className="h-2" />
        </div>

        {/* Sensor List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Sensors</h4>
          {data.sensors.map((sensor) => (
            <div
              key={sensor.id}
              className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded"
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(sensor.status)}
                <span className="text-sm">{sensor.name}</span>
              </div>
              <span className="text-sm font-medium">
                {sensor.value}
                {data.unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </BaseWidget>
  )
}
